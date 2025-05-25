import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, AlertTriangle, CheckCircle, MessageSquare, Bell } from 'lucide-react';
import { mockFaturas, mockPosts } from '@/data/mockData';
import { Fatura, Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationPopup } from './NotificationPopup';
import { generateWhatsAppLink, generateStudentPaymentMessage } from '@/utils/whatsappUtils';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info';
}

export const DashboardAluno: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [novasMensagens, setNovasMensagens] = useState<Post[]>([]);
  const [mensagensLidas, setMensagensLidas] = useState<string[]>([]);
  
  const minhasFaturas = mockFaturas.filter(f => f.usuarioId === user?.id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const enviarComprovanteWhatsApp = (fatura: Fatura) => {
    const mensagem = generateStudentPaymentMessage(
      'Professor',
      user?.nomeCompleto || 'Aluno',
      fatura.valor,
      fatura.dataVencimento
    );
    
    const professorPhone = '5511999999999';
    const whatsappUrl = generateWhatsAppLink(professorPhone, mensagem);
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Aberto",
      description: "Mensagem preparada para envio do comprovante",
    });
  };

  const marcarMensagemComoLida = (postId: string) => {
    setMensagensLidas(prev => [...prev, postId]);
  };

  const getStatusColor = (fatura: Fatura) => {
    if (fatura.status === 'Pago') return 'text-green-600';
    if (fatura.status === 'Atrasado') return 'text-red-600';
    
    const hoje = new Date();
    const vencimento = new Date(fatura.dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3 && diffDays >= 0) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getDiasParaVencimento = (dataVencimento: Date) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrasado`;
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `${diffDays} dias`;
  };

  useEffect(() => {
    // Verificar mensagens novas do professor
    const mensagensProfessor = mockPosts.filter(post => 
      post.autor.tipoUsuario === 'Professor' && 
      !mensagensLidas.includes(post.id)
    );
    
    if (mensagensProfessor.length > 0) {
      setNovasMensagens(mensagensProfessor);
      
      // Criar notificação de mensagem nova
      const notification: Notification = {
        id: `msg-${Date.now()}`,
        title: 'Novas Mensagens!',
        message: `Você tem ${mensagensProfessor.length} nova(s) mensagem(ns) do professor`,
        type: 'info'
      };
      
      setNotifications(prev => [notification, ...prev]);
    }

    // Simular notificações automáticas
    const checkNotifications = () => {
      const hoje = new Date();
      const newNotifications: Notification[] = [];

      minhasFaturas.forEach(fatura => {
        if (fatura.status === 'Pendente') {
          const vencimento = new Date(fatura.dataVencimento);
          const diffTime = vencimento.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // 3 dias antes
          if (diffDays === 3) {
            newNotifications.push({
              id: `fatura-${fatura.id}-3days`,
              title: 'Lembrete de Pagamento',
              message: `Sua mensalidade de ${formatCurrency(fatura.valor)} vence em 3 dias (${formatDate(fatura.dataVencimento)})`,
              type: 'warning'
            });
          }
          
          // No dia
          if (diffDays === 0) {
            newNotifications.push({
              id: `fatura-${fatura.id}-today`,
              title: 'Vencimento Hoje!',
              message: `Sua mensalidade de ${formatCurrency(fatura.valor)} vence hoje`,
              type: 'warning'
            });
          }
          
          // 1 dia após
          if (diffDays === -1) {
            newNotifications.push({
              id: `fatura-${fatura.id}-late`,
              title: 'Pagamento em Atraso',
              message: `Sua mensalidade de ${formatCurrency(fatura.valor)} está atrasada desde ontem`,
              type: 'warning'
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
    };

    const timer = setTimeout(checkNotifications, 2000);
    return () => clearTimeout(timer);
  }, [minhasFaturas, mensagensLidas]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const faturasAbertas = minhasFaturas.filter(f => f.status !== 'Pago');
  const faturasAtrasadas = faturasAbertas.filter(f => {
    const hoje = new Date();
    const vencimento = new Date(f.dataVencimento);
    return vencimento < hoje;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meu Dashboard</h1>
        {novasMensagens.length > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            <Bell className="w-3 h-3 mr-1" />
            {novasMensagens.length} nova(s) mensagem(ns)
          </Badge>
        )}
      </div>

      {/* Novas Mensagens do Professor */}
      {novasMensagens.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageSquare className="w-5 h-5" />
              Novas Mensagens do Professor
            </CardTitle>
            <CardDescription>
              Você tem {novasMensagens.length} mensagem(ns) nova(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {novasMensagens.slice(0, 3).map((mensagem) => (
                <div key={mensagem.id} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{mensagem.autor.nomeCompleto}</h4>
                    <span className="text-xs text-gray-500">{formatDateTime(mensagem.dataPublicacao)}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{mensagem.mensagem}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => marcarMensagemComoLida(mensagem.id)}
                    className="mt-2"
                  >
                    Marcar como lida
                  </Button>
                </div>
              ))}
              {novasMensagens.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  E mais {novasMensagens.length - 3} mensagem(ns)...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Abertas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faturasAbertas.length}</div>
            <p className="text-xs text-muted-foreground">
              Total: {formatCurrency(faturasAbertas.reduce((acc, f) => acc + f.valor, 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos em Dia</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {minhasFaturas.filter(f => f.status === 'Pago').length}
            </div>
            <p className="text-xs text-muted-foreground">Parabéns!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{faturasAtrasadas.length}</div>
            <p className="text-xs text-muted-foreground">
              {faturasAtrasadas.length > 0 ? 'Necessário pagamento' : 'Tudo em dia!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Vencimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximos Vencimentos
          </CardTitle>
          <CardDescription>Suas mensalidades e prazos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faturasAbertas.map((fatura) => (
              <div key={fatura.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Mensalidade</h3>
                    <Badge 
                      variant={
                        fatura.status === 'Atrasado' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {fatura.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Vencimento: {formatDate(fatura.dataVencimento)}</p>
                  <p className="text-sm font-medium">{formatCurrency(fatura.valor)}</p>
                  <p className={`text-xs font-medium ${getStatusColor(fatura)}`}>
                    {getDiasParaVencimento(fatura.dataVencimento)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">PIX para pagamento:</p>
                    <code className="text-xs bg-gray-100 p-2 rounded">professor@pota.com</code>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => enviarComprovanteWhatsApp(fatura)}
                    className="bg-green-600 hover:bg-green-700 mt-2"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Enviar Comprovante
                  </Button>
                </div>
              </div>
            ))}
            
            {faturasAbertas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>Parabéns! Você está em dia com suas mensalidades.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Todas as suas mensalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {minhasFaturas.map((fatura) => (
              <div key={fatura.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Mensalidade</h3>
                    <Badge 
                      variant={
                        fatura.status === 'Pago' ? 'secondary' : 
                        fatura.status === 'Atrasado' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {fatura.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Vencimento: {formatDate(fatura.dataVencimento)}</p>
                  <p className="text-sm font-medium">{formatCurrency(fatura.valor)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {fatura.status === 'Pago' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {fatura.status !== 'Pago' && (
                    <Button
                      size="sm"
                      onClick={() => enviarComprovanteWhatsApp(fatura)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Enviar Comprovante
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificações Pop-up */}
      {notifications.map((notification) => (
        <NotificationPopup
          key={notification.id}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

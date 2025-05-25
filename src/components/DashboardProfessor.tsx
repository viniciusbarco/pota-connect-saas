
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { mockFaturas } from '@/data/mockData';
import { Fatura } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const DashboardProfessor: React.FC = () => {
  const [faturas, setFaturas] = useState<Fatura[]>(mockFaturas);
  const { toast } = useToast();

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const isVencendoEm7Dias = (dataVencimento: Date) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isAtrasado = (dataVencimento: Date) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  const enviarLembreteWhatsApp = (fatura: Fatura) => {
    const textoMensagem = encodeURIComponent(
      `Olá ${fatura.usuario.nomeCompleto}, tudo bem? Sua mensalidade de ${formatCurrency(fatura.valor)} vence em ${formatDate(fatura.dataVencimento)}. Me manda o comprovante por aqui, por favor. Obrigado!\n\nPIX: professor@pota.com`
    );
    
    const numeroLimpo = fatura.usuario.telefoneWhatsApp.replace(/\D/g, '');
    const urlWhatsApp = `https://wa.me/${numeroLimpo}?text=${textoMensagem}`;
    
    window.open(urlWhatsApp, '_blank');
    
    toast({
      title: "WhatsApp Aberto",
      description: `Lembrete enviado para ${fatura.usuario.nomeCompleto}`,
    });
  };

  const marcarComoPago = (faturaId: string) => {
    setFaturas(prev => 
      prev.map(f => 
        f.id === faturaId 
          ? { ...f, status: 'Pago' as const }
          : f
      )
    );
    
    toast({
      title: "Fatura Atualizada",
      description: "Status alterado para 'Pago'",
    });
  };

  const faturasPendentes = faturas.filter(f => f.status === 'Pendente');
  const faturasAtrasadas = faturas.filter(f => isAtrasado(f.dataVencimento) && f.status !== 'Pago');
  const faturasVencendo = faturas.filter(f => isVencendoEm7Dias(f.dataVencimento) && f.status === 'Pendente');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard do Professor</h1>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faturasPendentes.length}</div>
            <p className="text-xs text-muted-foreground">
              Total: {formatCurrency(faturasPendentes.reduce((acc, f) => acc + f.valor, 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 7 dias</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{faturasVencendo.length}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{faturasAtrasadas.length}</div>
            <p className="text-xs text-muted-foreground">Ação urgente necessária</p>
          </CardContent>
        </Card>
      </div>

      {/* Faturas Atrasadas */}
      {faturasAtrasadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Faturas Atrasadas
            </CardTitle>
            <CardDescription>Faturas que já passaram do vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faturasAtrasadas.map((fatura) => (
                <div key={fatura.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{fatura.usuario.nomeCompleto}</h3>
                      <Badge variant="destructive">Atrasado</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Vencimento: {formatDate(fatura.dataVencimento)}</p>
                    <p className="text-sm font-medium">{formatCurrency(fatura.valor)}</p>
                    <p className="text-xs text-gray-500">{formatPhone(fatura.usuario.telefoneWhatsApp)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => enviarLembreteWhatsApp(fatura)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Lembrar pelo Zap
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => marcarComoPago(fatura.id)}
                    >
                      Marcar como Pago
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Faturas Vencendo em 7 dias */}
      {faturasVencendo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Calendar className="w-5 h-5" />
              Vencendo nos Próximos 7 Dias
            </CardTitle>
            <CardDescription>Faturas que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faturasVencendo.map((fatura) => (
                <div key={fatura.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{fatura.usuario.nomeCompleto}</h3>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Vencendo</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Vencimento: {formatDate(fatura.dataVencimento)}</p>
                    <p className="text-sm font-medium">{formatCurrency(fatura.valor)}</p>
                    <p className="text-xs text-gray-500">{formatPhone(fatura.usuario.telefoneWhatsApp)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => enviarLembreteWhatsApp(fatura)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Lembrar pelo Zap
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => marcarComoPago(fatura.id)}
                    >
                      Marcar como Pago
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todas as Faturas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Faturas</CardTitle>
          <CardDescription>Histórico completo de faturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faturas.map((fatura) => (
              <div key={fatura.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{fatura.usuario.nomeCompleto}</h3>
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
                {fatura.status !== 'Pago' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => enviarLembreteWhatsApp(fatura)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Zap
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => marcarComoPago(fatura.id)}
                    >
                      Marcar Pago
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

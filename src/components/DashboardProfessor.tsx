
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Calendar, DollarSign, AlertTriangle, Filter } from 'lucide-react';
import { mockFaturas } from '@/data/mockData';
import { Fatura } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generateWhatsAppLink, generateProfessorReminderMessage } from '@/utils/whatsappUtils';

type FilterType = 'todas' | 'vencendo3dias' | 'venceHoje' | 'atrasadas';

export const DashboardProfessor: React.FC = () => {
  const [faturas, setFaturas] = useState<Fatura[]>(mockFaturas);
  const [filtroAtivo, setFiltroAtivo] = useState<FilterType>('todas');
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

  const isVencendoEm3Dias = (dataVencimento: Date) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const isVenceHoje = (dataVencimento: Date) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0;
  };

  const isAtrasado = (dataVencimento: Date) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  const enviarLembreteWhatsApp = (fatura: Fatura) => {
    const mensagem = generateProfessorReminderMessage(
      fatura.usuario.nomeCompleto,
      fatura.valor,
      fatura.dataVencimento
    );
    
    const whatsappUrl = generateWhatsAppLink(fatura.usuario.telefoneWhatsApp, mensagem);
    
    window.open(whatsappUrl, '_blank');
    
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

  const getFaturasFiltradas = () => {
    const faturasPendentes = faturas.filter(f => f.status === 'Pendente');
    
    switch (filtroAtivo) {
      case 'vencendo3dias':
        return faturasPendentes.filter(f => isVencendoEm3Dias(f.dataVencimento));
      case 'venceHoje':
        return faturasPendentes.filter(f => isVenceHoje(f.dataVencimento));
      case 'atrasadas':
        return faturas.filter(f => isAtrasado(f.dataVencimento) && f.status !== 'Pago');
      default:
        return faturas;
    }
  };

  const faturasPendentes = faturas.filter(f => f.status === 'Pendente');
  const faturasAtrasadas = faturas.filter(f => isAtrasado(f.dataVencimento) && f.status !== 'Pago');
  const faturasVencendo3Dias = faturasPendentes.filter(f => isVencendoEm3Dias(f.dataVencimento));
  const faturasVenceHoje = faturasPendentes.filter(f => isVenceHoje(f.dataVencimento));

  const faturasFiltradas = getFaturasFiltradas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard do Professor</h1>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Vencendo em 3 dias</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{faturasVencendo3Dias.length}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vence Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{faturasVenceHoje.length}</div>
            <p className="text-xs text-muted-foreground">Urgente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{faturasAtrasadas.length}</div>
            <p className="text-xs text-muted-foreground">Ação necessária</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filtroAtivo === 'todas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroAtivo('todas')}
            >
              Todas ({faturas.length})
            </Button>
            <Button
              variant={filtroAtivo === 'vencendo3dias' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroAtivo('vencendo3dias')}
              className={filtroAtivo === 'vencendo3dias' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              Vencendo em 3 dias ({faturasVencendo3Dias.length})
            </Button>
            <Button
              variant={filtroAtivo === 'venceHoje' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroAtivo('venceHoje')}
              className={filtroAtivo === 'venceHoje' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Vence hoje ({faturasVenceHoje.length})
            </Button>
            <Button
              variant={filtroAtivo === 'atrasadas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroAtivo('atrasadas')}
              className={filtroAtivo === 'atrasadas' ? 'bg-red-700 hover:bg-red-800' : ''}
            >
              Atrasadas ({faturasAtrasadas.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Faturas Filtradas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filtroAtivo === 'todas' && 'Todas as Faturas'}
            {filtroAtivo === 'vencendo3dias' && 'Faturas Vencendo em 3 Dias'}
            {filtroAtivo === 'venceHoje' && 'Faturas que Vencem Hoje'}
            {filtroAtivo === 'atrasadas' && 'Faturas Atrasadas'}
          </CardTitle>
          <CardDescription>
            {faturasFiltradas.length} fatura(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faturasFiltradas.map((fatura) => {
              const isAtrasada = isAtrasado(fatura.dataVencimento);
              const venceHoje = isVenceHoje(fatura.dataVencimento);
              const vencendo3Dias = isVencendoEm3Dias(fatura.dataVencimento);
              
              let cardClass = 'border';
              if (isAtrasada && fatura.status !== 'Pago') cardClass += ' border-red-200 bg-red-50';
              else if (venceHoje && fatura.status === 'Pendente') cardClass += ' border-red-200 bg-red-50';
              else if (vencendo3Dias && fatura.status === 'Pendente') cardClass += ' border-orange-200 bg-orange-50';

              return (
                <div key={fatura.id} className={`flex items-center justify-between p-4 rounded-lg ${cardClass}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{fatura.usuario.nomeCompleto}</h3>
                      <Badge 
                        variant={
                          fatura.status === 'Pago' ? 'secondary' : 
                          isAtrasada && fatura.status !== 'Pago' ? 'destructive' : 
                          'outline'
                        }
                      >
                        {fatura.status}
                      </Badge>
                      {venceHoje && fatura.status === 'Pendente' && (
                        <Badge variant="destructive">Vence Hoje!</Badge>
                      )}
                      {vencendo3Dias && fatura.status === 'Pendente' && (
                        <Badge className="bg-orange-100 text-orange-800">Vencendo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Vencimento: {formatDate(fatura.dataVencimento)}</p>
                    <p className="text-sm font-medium">{formatCurrency(fatura.valor)}</p>
                    <p className="text-xs text-gray-500">{formatPhone(fatura.usuario.telefoneWhatsApp)}</p>
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
              );
            })}
            
            {faturasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma fatura encontrada para o filtro selecionado.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

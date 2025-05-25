
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Settings, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfiguracaoPlanosProps {
  onVoltar: () => void;
}

export const ConfiguracaoPlanos: React.FC<ConfiguracaoPlanosProps> = ({ onVoltar }) => {
  const { toast } = useToast();
  
  const [planos, setPlanos] = useState([
    { id: 'basico', nome: 'Básico', valor: 150 },
    { id: 'intermediario', nome: 'Intermediário', valor: 250 },
    { id: 'avancado', nome: 'Avançado', valor: 350 },
    { id: 'premium', nome: 'Premium', valor: 500 }
  ]);

  const [mensagens, setMensagens] = useState({
    lembrete: 'Olá {nome}, sua mensalidade de {valor} vence em {dias} dias ({data}). Para pagamento via PIX: professor@pota.com',
    vencimento: 'Olá {nome}, sua mensalidade de {valor} vence hoje ({data}). Para pagamento via PIX: professor@pota.com',
    atraso: 'Olá {nome}, sua mensalidade de {valor} está em atraso desde {data}. Por favor, regularize o pagamento. PIX: professor@pota.com'
  });

  const [novoPlano, setNovoPlano] = useState({ nome: '', valor: '' });

  const adicionarPlano = () => {
    if (!novoPlano.nome || !novoPlano.valor) {
      toast({
        title: "Erro",
        description: "Preencha o nome e valor do plano",
        variant: "destructive",
      });
      return;
    }

    const plano = {
      id: novoPlano.nome.toLowerCase().replace(/\s+/g, ''),
      nome: novoPlano.nome,
      valor: parseFloat(novoPlano.valor)
    };

    setPlanos(prev => [...prev, plano]);
    setNovoPlano({ nome: '', valor: '' });
    
    toast({
      title: "Plano Adicionado",
      description: `Plano ${plano.nome} foi criado com sucesso!`,
    });
  };

  const removerPlano = (id: string) => {
    setPlanos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Plano Removido",
      description: "Plano foi removido com sucesso!",
    });
  };

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações Salvas",
      description: "Todas as configurações foram salvas com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onVoltar}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Configuração de Planos e Mensagens</h1>
      </div>

      {/* Gestão de Planos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Planos Disponíveis
          </CardTitle>
          <CardDescription>
            Gerencie os planos de aulas e seus valores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planos.map((plano) => (
              <div key={plano.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{plano.nome}</h3>
                  <p className="text-sm text-gray-600">R$ {plano.valor.toFixed(2)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removerPlano(plano.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Adicionar Novo Plano</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do plano"
                value={novoPlano.nome}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, nome: e.target.value }))}
              />
              <Input
                placeholder="Valor (R$)"
                type="number"
                value={novoPlano.valor}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, valor: e.target.value }))}
              />
              <Button onClick={adicionarPlano}>Adicionar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuração de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Configuração de Mensagens
          </CardTitle>
          <CardDescription>
            Personalize as mensagens automáticas. Use {nome}, {valor}, {data}, {dias} como variáveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lembrete">Mensagem de Lembrete (3 dias antes)</Label>
            <Textarea
              id="lembrete"
              value={mensagens.lembrete}
              onChange={(e) => setMensagens(prev => ({ ...prev, lembrete: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="vencimento">Mensagem de Vencimento (no dia)</Label>
            <Textarea
              id="vencimento"
              value={mensagens.vencimento}
              onChange={(e) => setMensagens(prev => ({ ...prev, vencimento: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="atraso">Mensagem de Atraso</Label>
            <Textarea
              id="atraso"
              value={mensagens.atraso}
              onChange={(e) => setMensagens(prev => ({ ...prev, atraso: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={salvarConfiguracoes} className="bg-green-600 hover:bg-green-700">
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
};

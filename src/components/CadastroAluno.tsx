
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CadastroAlunoProps {
  onVoltar: () => void;
}

export const CadastroAluno: React.FC<CadastroAlunoProps> = ({ onVoltar }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefoneWhatsApp: '',
    plano: '',
    dataVencimento: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeCompleto || !formData.email || !formData.telefoneWhatsApp || !formData.plano) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simular cadastro do aluno
    toast({
      title: "Aluno Cadastrado",
      description: `${formData.nomeCompleto} foi cadastrado com sucesso!`,
    });
    
    // Limpar formulário
    setFormData({
      nomeCompleto: '',
      email: '',
      telefoneWhatsApp: '',
      plano: '',
      dataVencimento: ''
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
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Aluno</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Dados do Aluno
          </CardTitle>
          <CardDescription>
            Preencha as informações do novo aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                  placeholder="Digite o nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefone">WhatsApp *</Label>
                <Input
                  id="telefone"
                  value={formData.telefoneWhatsApp}
                  onChange={(e) => handleInputChange('telefoneWhatsApp', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="plano">Plano *</Label>
                <Select value={formData.plano} onValueChange={(value) => handleInputChange('plano', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico - R$ 150,00</SelectItem>
                    <SelectItem value="intermediario">Intermediário - R$ 250,00</SelectItem>
                    <SelectItem value="avancado">Avançado - R$ 350,00</SelectItem>
                    <SelectItem value="premium">Premium - R$ 500,00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="dataVencimento">Data de Vencimento (opcional)</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar Aluno
              </Button>
              <Button type="button" variant="outline" onClick={onVoltar}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

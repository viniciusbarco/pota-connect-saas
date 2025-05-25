
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, User, Calendar } from 'lucide-react';
import { mockPosts } from '@/data/mockData';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const Mural: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [filtroAutor, setFiltroAutor] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const criarPost = () => {
    if (!novaMensagem.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem para publicar",
        variant: "destructive",
      });
      return;
    }

    const novoPost: Post = {
      id: Date.now().toString(),
      autorId: user!.id,
      autor: {
        id: user!.id,
        email: user!.email,
        nomeCompleto: user!.nomeCompleto,
        tipoUsuario: user!.tipoUsuario,
        telefoneWhatsApp: user!.telefoneWhatsApp,
        createdAt: new Date()
      },
      mensagem: novaMensagem,
      dataPublicacao: new Date()
    };

    setPosts(prev => [novoPost, ...prev]);
    setNovaMensagem('');
    setMostrarFormulario(false);

    toast({
      title: "Post Publicado",
      description: "Sua mensagem foi adicionada ao mural",
    });
  };

  const postsFiltrados = posts.filter(post => 
    filtroAutor === '' || 
    post.autor.nomeCompleto.toLowerCase().includes(filtroAutor.toLowerCase())
  );

  const autoresUnicos = Array.from(new Set(posts.map(p => p.autor.nomeCompleto)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mural de Recados</h1>
        {user?.tipoUsuario === 'Professor' && (
          <Button 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-pota-pink hover:bg-pota-pink/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Recado
          </Button>
        )}
      </div>

      {/* Formulário de Novo Post - Apenas para Professor */}
      {user?.tipoUsuario === 'Professor' && mostrarFormulario && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Criar Novo Recado</CardTitle>
            <CardDescription>Publique uma mensagem para todos os alunos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                placeholder="Digite sua mensagem aqui..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={criarPost}
                className="bg-pota-pink hover:bg-pota-pink/90"
              >
                Publicar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setMostrarFormulario(false);
                  setNovaMensagem('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="filtro-autor">Filtrar por autor</Label>
              <Input
                id="filtro-autor"
                placeholder="Digite o nome do autor..."
                value={filtroAutor}
                onChange={(e) => setFiltroAutor(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setFiltroAutor('')}
            >
              Limpar
            </Button>
          </div>
          
          {autoresUnicos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Autores disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {autoresUnicos.map(autor => (
                  <Button
                    key={autor}
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltroAutor(autor)}
                    className={`${filtroAutor === autor ? 'bg-pota-pink text-white' : ''}`}
                  >
                    {autor}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Posts */}
      <div className="space-y-4">
        {postsFiltrados.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {filtroAutor ? 'Nenhum post encontrado para este autor' : 'Nenhum recado publicado ainda'}
              </p>
            </CardContent>
          </Card>
        )}

        {postsFiltrados.map((post) => (
          <Card key={post.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pota-pink to-pota-blue rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{post.autor.nomeCompleto}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(post.dataPublicacao)}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.autor.tipoUsuario === 'Professor' 
                      ? 'bg-pota-pink-light text-pota-pink' 
                      : 'bg-pota-blue-light text-pota-blue'
                  }`}>
                    {post.autor.tipoUsuario}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.mensagem}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};


import { Post, Fatura, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'professor@pota.com',
    nomeCompleto: 'Maria Silva',
    tipoUsuario: 'Professor',
    telefoneWhatsApp: '5511999999999',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'aluno@pota.com',
    nomeCompleto: 'João Santos',
    tipoUsuario: 'Aluno',
    telefoneWhatsApp: '5511888888888',
    createdAt: new Date('2024-01-02')
  },
  {
    id: '3',
    email: 'ana@pota.com',
    nomeCompleto: 'Ana Costa',
    tipoUsuario: 'Aluno',
    telefoneWhatsApp: '5511777777777',
    createdAt: new Date('2024-01-03')
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    autorId: '1',
    autor: mockUsers[0],
    mensagem: 'Bem-vindos ao novo semestre! Lembrem-se de que as aulas começam na próxima segunda-feira às 8h.',
    dataPublicacao: new Date('2024-01-15T10:00:00')
  },
  {
    id: '2',
    autorId: '1',
    autor: mockUsers[0],
    mensagem: 'Atenção: A prova de matemática foi adiada para sexta-feira. Estudem o capítulo 5 do livro.',
    dataPublicacao: new Date('2024-01-16T14:30:00')
  },
  {
    id: '3',
    autorId: '1',
    autor: mockUsers[0],
    mensagem: 'Parabéns a todos pela dedicação! Continuem assim que teremos um ótimo ano letivo.',
    dataPublicacao: new Date('2024-01-17T09:15:00')
  }
];

export const mockFaturas: Fatura[] = [
  {
    id: '1',
    usuarioId: '2',
    usuario: mockUsers[1],
    dataVencimento: new Date('2024-01-25'),
    valor: 150.00,
    status: 'Pendente',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    usuarioId: '3',
    usuario: mockUsers[2],
    dataVencimento: new Date('2024-01-28'),
    valor: 150.00,
    status: 'Atrasado',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    usuarioId: '2',
    usuario: mockUsers[1],
    dataVencimento: new Date('2024-02-25'),
    valor: 150.00,
    status: 'Pendente',
    createdAt: new Date('2024-02-01')
  }
];

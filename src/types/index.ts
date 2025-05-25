
export type UserType = 'Professor' | 'Aluno';

export type FaturaStatus = 'Pendente' | 'Pago' | 'Atrasado';

export interface User {
  id: string;
  email: string;
  nomeCompleto: string;
  tipoUsuario: UserType;
  telefoneWhatsApp: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  autorId: string;
  autor: User;
  mensagem: string;
  dataPublicacao: Date;
}

export interface Fatura {
  id: string;
  usuarioId: string;
  usuario: User;
  dataVencimento: Date;
  valor: number;
  status: FaturaStatus;
  createdAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  nomeCompleto: string;
  tipoUsuario: UserType;
  telefoneWhatsApp: string;
}

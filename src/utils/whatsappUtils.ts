
export const formatWhatsAppNumber = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Se não começar com 55 (código do Brasil), adiciona
  if (!cleaned.startsWith('55')) {
    return `55${cleaned}`;
  }
  
  return cleaned;
};

export const generateWhatsAppLink = (phone: string, message: string): string => {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

export const generateProfessorReminderMessage = (
  studentName: string,
  amount: number,
  dueDate: Date,
  pixKey: string = 'professor@pota.com'
): string => {
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(dueDate);
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
  
  return `Olá ${studentName}, tudo bem? Sua mensalidade de ${formattedAmount} vence em ${formattedDate}. Me manda o comprovante por aqui, por favor. Obrigado!\n\nPIX: ${pixKey}`;
};

export const generateStudentPaymentMessage = (
  professorName: string,
  studentName: string,
  amount: number,
  dueDate: Date
): string => {
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(dueDate);
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
  
  return `Olá Professor, aqui é ${studentName}. Estou enviando o comprovante da mensalidade de ${formattedAmount}, com vencimento em ${formattedDate}. Obrigado!`;
};

/**
 * Formata valor monetário para exibição
 * @param {number} value - Valor numérico
 * @returns {string} - Valor formatado (R$ 0.000,00)
 */
export function formatCurrency(value) {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata data para exibição
 * @param {Date|string} date - Data
 * @returns {string} - Data formatada (DD/MM/YYYY)
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora para exibição
 * @param {Date|string} date - Data
 * @returns {string} - Data e hora formatada (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata telefone para exibição
 * @param {string} phone - Telefone
 * @returns {string} - Telefone formatado ((00) 00000-0000)
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Calcula tempo decorrido desde uma data
 * @param {Date|string} date - Data inicial
 * @returns {string} - Tempo decorrido (ex: "2 horas atrás")
 */
export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'} atrás`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atrás`;
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} atrás`;
  return formatDate(date);
}

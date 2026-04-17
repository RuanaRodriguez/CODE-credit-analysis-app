/**
 * Status possíveis para solicitações de crédito
 */
export const CREDIT_STATUS = {
  RASCUNHO: { value: 1, label: 'Rascunho', color: 'default' },
  SOLICITADA: { value: 2, label: 'Solicitada', color: 'info' },
  EM_ANALISE: { value: 3, label: 'Em Análise', color: 'warning' },
  EM_APROVACAO: { value: 4, label: 'Em Aprovação', color: 'secondary' },
  APROVADA: { value: 5, label: 'Aprovada', color: 'success' },
  REJEITADA: { value: 6, label: 'Rejeitada', color: 'error' },
  CANCELADA: { value: 7, label: 'Cancelada', color: 'default' },
};

/**
 * Níveis de risco de crédito
 */
export const RISK_LEVELS = {
  BAIXO: { value: 1, label: 'Baixo', color: 'success' },
  MEDIO: { value: 2, label: 'Médio', color: 'warning' },
  ALTO: { value: 3, label: 'Alto', color: 'error' },
  CRITICO: { value: 4, label: 'Crítico', color: 'error' },
};

/**
 * Alçadas de aprovação baseadas em valor
 */
export const APPROVAL_LEVELS = {
  LIDER: { min: 0, max: 10000, approver: 'Líder' },
  COORDENADOR: { min: 10000, max: 50000, approver: 'Coordenador' },
  GERENTE: { min: 50000, max: 100000, approver: 'Gerente' },
  GERENTE_GERAL: { min: 100000, max: 500000, approver: 'Gerente Geral' },
  DIRETORIA: { min: 500000, max: Infinity, approver: 'Diretoria' },
};

/**
 * Determina alçada baseada no valor
 * @param {number} value - Valor solicitado
 * @returns {object} - Objeto com informação da alçada
 */
export function getApprovalLevel(value) {
  for (const [key, level] of Object.entries(APPROVAL_LEVELS)) {
    if (value >= level.min && value < level.max) {
      return { level: key, ...level };
    }
  }
  return APPROVAL_LEVELS.DIRETORIA;
}

/**
 * Bandeiras disponíveis
 */
export const BANDEIRAS = [
  { id: 'visa', nome: 'Visa', codigo: 'VIS' },
  { id: 'mastercard', nome: 'Mastercard', codigo: 'MAS' },
  { id: 'elo', nome: 'Elo', codigo: 'ELO' },
  { id: 'hipercard', nome: 'Hipercard', codigo: 'HIP' },
  { id: 'american', nome: 'American Express', codigo: 'AME' },
];

/**
 * Modalidades de Venda
 */
export const MODALIDADES_VENDA = [
  { id: 'cartao_credito', nome: 'Cartão de Crédito' },
  { id: 'cartao_debito', nome: 'Cartão de Débito' },
  { id: 'boleto', nome: 'Boleto Bancário' },
  { id: 'pix', nome: 'PIX' },
  { id: 'parcelado', nome: 'Parcelado' },
];

/**
 * Motivos de Rejeição
 */
export const MOTIVOS_REJEICAO = [
  { id: 1, descricao: 'Score insuficiente' },
  { id: 2, descricao: 'Restrições cadastrais' },
  { id: 3, descricao: 'Documentação incompleta' },
  { id: 4, descricao: 'Renda insuficiente' },
  { id: 5, descricao: 'Valor acima da alçada disponível' },
  { id: 6, descricao: 'Histórico negativo' },
  { id: 7, descricao: 'Outros' },
];

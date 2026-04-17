import { CREDIT_STATUS, RISK_LEVELS, getApprovalLevel } from '../types/constants';

/**
 * Serviço de análise de score de crédito
 */
class ScoreService {
  /**
   * Calcula score de crédito baseado em dados do cliente
   * @param {object} customerData - Dados do cliente
   * @returns {object} - Score calculado com detalhes
   */
  static calculateScore(customerData) {
    let baseScore = 600;
    const factors = [];

    // Fator: Renda
    const income = customerData.income || 0;
    if (income > 10000) {
      baseScore += 150;
      factors.push({ factor: 'Renda Alta (>R$ 10.000)', impact: 150, positive: true });
    } else if (income > 5000) {
      baseScore += 100;
      factors.push({ factor: 'Renda Média (R$ 5.000-10.000)', impact: 100, positive: true });
    } else if (income < 2000) {
      baseScore -= 50;
      factors.push({ factor: 'Renda Baixa (<R$ 2.000)', impact: -50, positive: false });
    }

    // Fator: Valor solicitado vs Renda (comprometimento)
    const amount = customerData.amount || 0;
    const incomeRatio = amount / income;
    if (incomeRatio > 5) {
      baseScore -= 100;
      factors.push({ factor: 'Comprometimento Alto (>5x renda)', impact: -100, positive: false });
    } else if (incomeRatio < 2) {
      baseScore += 50;
      factors.push({ factor: 'Comprometimento Baixo (<2x renda)', impact: 50, positive: true });
    }

    // Fator: CPF/CNPJ válido
    if (customerData.cpfCnpjValid) {
      baseScore += 50;
      factors.push({ factor: 'Documento Válido', impact: 50, positive: true });
    }

    // Fator: Aleatoriedade simulada (simula consulta externa)
    const randomFactor = Math.floor(Math.random() * 100) - 50;
    if (randomFactor !== 0) {
      baseScore += randomFactor;
      factors.push({
        factor: 'Histórico de Crédito',
        impact: randomFactor,
        positive: randomFactor > 0,
      });
    }

    // Limita score entre 300 e 850
    const finalScore = Math.min(Math.max(baseScore, 300), 850);

    // Determina nível de risco
    let risk = RISK_LEVELS.BAIXO;
    if (finalScore < 500) {
      risk = RISK_LEVELS.CRITICO;
    } else if (finalScore < 600) {
      risk = RISK_LEVELS.ALTO;
    } else if (finalScore < 700) {
      risk = RISK_LEVELS.MEDIO;
    }

    return {
      id: `score-${Date.now()}`,
      score: finalScore,
      risk: risk.label,
      riskLevel: risk.value,
      factors,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Simula consulta de score externo (Serasa, etc)
   * @param {string} cpfCnpj - CPF ou CNPJ
   * @returns {Promise<object>} - Score simulado
   */
  static async consultExternalScore(cpfCnpj) {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Gera score baseado no documento (para consistência)
    const hash = cpfCnpj.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseScore = 500 + (hash % 300);

    return {
      score: baseScore,
      provider: 'Serasa Experian',
      consultedAt: new Date().toISOString(),
    };
  }
}

export default ScoreService;

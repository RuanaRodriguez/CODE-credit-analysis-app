import ScoreService from './scoreService';
import { CREDIT_STATUS, getApprovalLevel } from '../types/constants';

/**
 * Serviço de análise de crédito
 */
class CreditService {
  /**
   * Analisa solicitação de crédito
   * @param {object} request - Dados da solicitação
   * @returns {Promise<object>} - Resultado da análise
   */
  static async analyzeCreditRequest(request) {
    // Simula delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calcula score
    const scoreResult = ScoreService.calculateScore({
      income: request.income,
      amount: request.valorSolicitado,
      cpfCnpjValid: request.cpfCnpjValid,
    });

    // Determina alçada necessária
    const approvalLevel = getApprovalLevel(request.valorSolicitado);

    // Determina aprovação baseada em score e risco
    const approved = scoreResult.score >= 600 && scoreResult.riskLevel <= 2;

    // Calcula taxa de juros baseada em score
    let interest = 5.0; // Taxa base
    if (scoreResult.score > 750) {
      interest = 2.5;
    } else if (scoreResult.score > 650) {
      interest = 3.5;
    } else if (scoreResult.score > 550) {
      interest = 4.5;
    }

    // Calcula valor aprovado (pode ser menor que solicitado)
    let approvedAmount = request.valorSolicitado;
    if (approved && scoreResult.riskLevel === 2) {
      // Reduz 20% para risco médio
      approvedAmount = Math.floor(request.valorSolicitado * 0.8);
    }

    // Gera condições
    const conditions = this.generateConditions(scoreResult, approvalLevel);

    // Determina prazo baseado em valor
    let term = 12; // meses
    if (request.valorSolicitado > 50000) {
      term = 36;
    } else if (request.valorSolicitado > 20000) {
      term = 24;
    }

    return {
      id: `analysis-${Date.now()}`,
      creditRequestId: request.id,
      approved,
      approvedAmount: approved ? approvedAmount : 0,
      interest,
      term,
      conditions,
      score: scoreResult,
      approvalLevel: approvalLevel.approver,
      analysisDate: new Date().toISOString(),
      nextStatus: approved ? CREDIT_STATUS.EM_APROVACAO : CREDIT_STATUS.REJEITADA,
    };
  }

  /**
   * Gera condições baseadas em análise
   * @param {object} scoreResult - Resultado do score
   * @param {object} approvalLevel - Nível de aprovação
   * @returns {Array<string>} - Lista de condições
   */
  static generateConditions(scoreResult, approvalLevel) {
    const conditions = [];

    if (scoreResult.riskLevel >= 2) {
      conditions.push('Comprovante de renda atualizado obrigatório');
    }

    if (scoreResult.riskLevel >= 3) {
      conditions.push('Consulta adicional ao Serasa necessária');
      conditions.push('Apresentar 3 últimos extratos bancários');
    }

    conditions.push(`Aprovação necessária: ${approvalLevel.approver}`);

    if (scoreResult.score < 700) {
      conditions.push('Garantia adicional recomendada');
    }

    return conditions;
  }

  /**
   * Valida documentação da solicitação
   * @param {object} request - Solicitação
   * @returns {object} - Resultado da validação
   */
  static validateDocumentation(request) {
    const errors = [];
    const warnings = [];

    if (!request.cpfCnpj) errors.push('CPF/CNPJ é obrigatório');
    if (!request.nomeRazaoSocial) errors.push('Nome/Razão Social é obrigatório');
    if (!request.valorSolicitado || request.valorSolicitado <= 0) {
      errors.push('Valor solicitado deve ser maior que zero');
    }
    if (!request.income || request.income <= 0) {
      errors.push('Renda é obrigatória');
    }

    if (request.valorSolicitado > request.income * 10) {
      warnings.push('Valor solicitado é muito alto em relação à renda');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export default CreditService;

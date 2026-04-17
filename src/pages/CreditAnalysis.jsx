import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreditContext } from '../contexts/CreditContext';
import { validateCPF } from '../utils/cpfValidator';
import { validateCNPJ } from '../utils/cnpjValidator';
import { formatCurrency } from '../utils/formatters';
import CreditService from '../services/creditService';
import { BANDEIRAS, MODALIDADES_VENDA, CREDIT_STATUS } from '../types/constants';

const steps = ['Dados do Cliente', 'Análise de Crédito', 'Resultado'];

function CreditAnalysis() {
  const navigate = useNavigate();
  const { addCredit, updateCredit } = useCreditContext();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    cpfCnpj: '',
    nomeRazaoSocial: '',
    email: '',
    telefone: '',
    valorSolicitado: '',
    income: '',
    bandeiraId: '',
    modalidadeVendaId: '',
    observacoes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa erro ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.cpfCnpj) {
      newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    } else {
      const cleanDoc = formData.cpfCnpj.replace(/\D/g, '');
      if (cleanDoc.length === 11 && !validateCPF(cleanDoc)) {
        newErrors.cpfCnpj = 'CPF inválido';
      } else if (cleanDoc.length === 14 && !validateCNPJ(cleanDoc)) {
        newErrors.cpfCnpj = 'CNPJ inválido';
      } else if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
        newErrors.cpfCnpj = 'CPF/CNPJ inválido';
      }
    }

    if (!formData.nomeRazaoSocial) {
      newErrors.nomeRazaoSocial = 'Nome/Razão Social é obrigatório';
    }

    if (!formData.valorSolicitado || parseFloat(formData.valorSolicitado) <= 0) {
      newErrors.valorSolicitado = 'Valor deve ser maior que zero';
    }

    if (!formData.income || parseFloat(formData.income) <= 0) {
      newErrors.income = 'Renda é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!validateStep1()) return;
      
      // Salva solicitação inicial
      const newCredit = addCredit({
        ...formData,
        valorSolicitado: parseFloat(formData.valorSolicitado),
        income: parseFloat(formData.income),
        status: CREDIT_STATUS.EM_ANALISE.label,
        cpfCnpjValid: true,
      });

      setActiveStep(1);

      // Inicia análise
      setLoading(true);
      try {
        const result = await CreditService.analyzeCreditRequest({
          ...newCredit,
          valorSolicitado: parseFloat(formData.valorSolicitado),
          income: parseFloat(formData.income),
          cpfCnpjValid: true,
        });

        setAnalysisResult(result);
        
        // Atualiza crédito com resultado
        updateCredit(newCredit.id, {
          status: result.nextStatus.label,
          analysisResult: result,
        });

        setActiveStep(2);
      } catch (error) {
        console.error('Erro na análise:', error);
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      cpfCnpj: '',
      nomeRazaoSocial: '',
      email: '',
      telefone: '',
      valorSolicitado: '',
      income: '',
      bandeiraId: '',
      modalidadeVendaId: '',
      observacoes: '',
    });
    setAnalysisResult(null);
    setErrors({});
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Análise de Crédito
      </Typography>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF/CNPJ"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleChange}
                  error={!!errors.cpfCnpj}
                  helperText={errors.cpfCnpj}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome/Razão Social"
                  name="nomeRazaoSocial"
                  value={formData.nomeRazaoSocial}
                  onChange={handleChange}
                  error={!!errors.nomeRazaoSocial}
                  helperText={errors.nomeRazaoSocial}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor Solicitado"
                  name="valorSolicitado"
                  type="number"
                  value={formData.valorSolicitado}
                  onChange={handleChange}
                  error={!!errors.valorSolicitado}
                  helperText={errors.valorSolicitado}
                  required
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Renda Mensal"
                  name="income"
                  type="number"
                  value={formData.income}
                  onChange={handleChange}
                  error={!!errors.income}
                  helperText={errors.income}
                  required
                  InputProps={{ startAdornment: 'R$' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Bandeira"
                  name="bandeiraId"
                  value={formData.bandeiraId}
                  onChange={handleChange}
                >
                  {BANDEIRAS.map(bandeira => (
                    <MenuItem key={bandeira.id} value={bandeira.id}>
                      {bandeira.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Modalidade de Venda"
                  name="modalidadeVendaId"
                  value={formData.modalidadeVendaId}
                  onChange={handleChange}
                >
                  {MODALIDADES_VENDA.map(modalidade => (
                    <MenuItem key={modalidade.id} value={modalidade.id}>
                      {modalidade.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Analisando solicitação...
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                Consultando score, validando documentos e calculando risco
              </Typography>
            </Box>
          )}

          {activeStep === 2 && analysisResult && (
            <Box>
              <Alert 
                severity={analysisResult.approved ? 'success' : 'error'}
                sx={{ mb: 3 }}
              >
                <Typography variant="h6">
                  {analysisResult.approved ? '✓ Crédito Aprovado' : '✗ Crédito Negado'}
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Score de Crédito
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {analysisResult.score.score}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Risco: {analysisResult.score.risk}
                    </Typography>
                  </Paper>
                </Grid>

                {analysisResult.approved && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Valor Aprovado
                        </Typography>
                        <Typography variant="h3" color="success.main">
                          {formatCurrency(analysisResult.approvedAmount)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Taxa: {analysisResult.interest}% a.m. - {analysisResult.term} meses
                        </Typography>
                      </Paper>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Condições
                  </Typography>
                  {analysisResult.conditions.map((condition, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      • {condition}
                    </Typography>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Fatores de Score
                  </Typography>
                  {analysisResult.score.factors.map((factor, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      sx={{ mb: 1 }}
                      color={factor.positive ? 'success.main' : 'error.main'}
                    >
                      {factor.positive ? '+ ' : '- '}
                      {factor.factor} ({factor.impact > 0 ? '+' : ''}{factor.impact})
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Box>
              {activeStep === 2 ? (
                <>
                  <Button onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
                    Ir ao Dashboard
                  </Button>
                  <Button variant="contained" onClick={handleReset}>
                    Nova Análise
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  {activeStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreditAnalysis;

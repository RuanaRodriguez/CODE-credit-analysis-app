import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { CREDIT_STATUS } from '../../types/constants';

function CreditDetailsModal({ open, onClose, credit }) {
  if (!credit) return null;

  const getStatusColor = (status) => {
    const statusObj = Object.values(CREDIT_STATUS).find(s => s.label === status);
    return statusObj?.color || 'default';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon color="primary" />
          <Typography variant="h6">
            Detalhes da Solicitação
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Cabeçalho com Status */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {credit.numeroSolicitacao}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Criado em {formatDateTime(credit.dataInclusao)}
            </Typography>
          </Box>
          <Chip 
            label={credit.status || 'Rascunho'} 
            color={getStatusColor(credit.status)}
            size="medium"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Dados do Cliente */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              Dados do Cliente
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Nome/Razão Social</Typography>
              <Typography variant="body1" fontWeight="500">{credit.nomeRazaoSocial}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">CPF/CNPJ</Typography>
              <Typography variant="body1" fontWeight="500">{credit.cpfCnpj}</Typography>
            </Grid>
            {credit.email && (
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Email</Typography>
                <Typography variant="body1" fontWeight="500">{credit.email}</Typography>
              </Grid>
            )}
            {credit.telefone && (
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Telefone</Typography>
                <Typography variant="body1" fontWeight="500">{credit.telefone}</Typography>
              </Grid>
            )}
            {credit.income && (
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Renda Mensal</Typography>
                <Typography variant="body1" fontWeight="500">{formatCurrency(credit.income)}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Dados da Solicitação */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AttachMoneyIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              Detalhes da Solicitação
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Valor Solicitado</Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formatCurrency(credit.valorSolicitado)}
              </Typography>
            </Grid>
            {credit.analysisResult?.approved && (
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Valor Aprovado</Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {formatCurrency(credit.analysisResult.approvedAmount)}
                </Typography>
              </Grid>
            )}
            {credit.bandeiraId && (
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Bandeira</Typography>
                <Typography variant="body1" fontWeight="500">{credit.bandeiraId}</Typography>
              </Grid>
            )}
            {credit.modalidadeVendaId && (
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Modalidade</Typography>
                <Typography variant="body1" fontWeight="500">{credit.modalidadeVendaId}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Análise de Crédito */}
        {credit.analysisResult && (
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Resultado da Análise
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Score de Crédito</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {credit.analysisResult.score?.score}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Nível de Risco</Typography>
                <Chip 
                  label={credit.analysisResult.score?.risk}
                  color={credit.analysisResult.score?.riskLevel <= 2 ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              {credit.analysisResult.interest && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Taxa de Juros</Typography>
                  <Typography variant="body1" fontWeight="500">{credit.analysisResult.interest}% a.m.</Typography>
                </Grid>
              )}
              {credit.analysisResult.term && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Prazo</Typography>
                  <Typography variant="body1" fontWeight="500">{credit.analysisResult.term} meses</Typography>
                </Grid>
              )}
              {credit.analysisResult.conditions && credit.analysisResult.conditions.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Condições</Typography>
                  {credit.analysisResult.conditions.map((condition, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {condition}
                    </Typography>
                  ))}
                </Grid>
              )}
            </Grid>
          </Paper>
        )}

        {credit.observacoes && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="textSecondary">Observações</Typography>
            <Typography variant="body1">{credit.observacoes}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreditDetailsModal;

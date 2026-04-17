import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreditContext } from '../contexts/CreditContext';
import { CREDIT_STATUS } from '../types/constants';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CreditDetailsModal from '../components/common/CreditDetailsModal';

function Dashboard() {
  const navigate = useNavigate();
  const { credits } = useCreditContext();
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0,
    approvalRate: 0,
  });

  useEffect(() => {
    // Calcula estatísticas
    const total = credits.length;
    const approved = credits.filter(c => c.status === CREDIT_STATUS.APROVADA.label).length;
    const rejected = credits.filter(c => c.status === CREDIT_STATUS.REJEITADA.label).length;
    const pending = credits.filter(c => 
      c.status === CREDIT_STATUS.SOLICITADA.label || 
      c.status === CREDIT_STATUS.EM_ANALISE.label ||
      c.status === CREDIT_STATUS.EM_APROVACAO.label
    ).length;
    
    const newStats = {
      total,
      pending,
      approved,
      rejected,
      totalValue: credits.reduce((sum, c) => sum + (c.valorSolicitado || 0), 0),
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
    };
    setStats(newStats);
  }, [credits]);

  const getStatusColor = (status) => {
    const statusObj = Object.values(CREDIT_STATUS).find(s => s.label === status);
    return statusObj?.color || 'default';
  };

  // Últimas 5 solicitações
  const recentCredits = credits.slice(0, 5);

  const statsCards = [
    {
      title: 'Total de Solicitações',
      value: stats.total,
      subtitle: formatCurrency(stats.totalValue),
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #5E7CE2 0%, #4A5F7F 100%)',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      subtitle: 'Aguardando análise',
      icon: <PendingActionsIcon sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #E8753A 0%, #D35E28 100%)',
      trend: '+3',
      trendUp: true,
    },
    {
      title: 'Aprovadas',
      value: stats.approved,
      subtitle: `${stats.approvalRate}% de aprovação`,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #27AE60 0%, #229954 100%)',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Rejeitadas',
      value: stats.rejected,
      subtitle: stats.total > 0 ? `${(stats.rejected / stats.total * 100).toFixed(1)}% do total` : '0% do total',
      icon: <CancelIcon sx={{ fontSize: 40 }} />,
      color: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
      trend: '-2.1%',
      trendUp: false,
    },
  ];

  const handleViewDetails = (credit) => {
    setSelectedCredit(credit);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedCredit(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral completa das análises de crédito
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/analise')}
          sx={{
            px: 3,
            py: 1.5,
            boxShadow: '0 8px 16px rgba(255, 107, 53, 0.3)',
          }}
        >
          Nova Análise
        </Button>
      </Box>

      {/* Cards de estatísticas modernos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: card.color,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  top: -100,
                  right: -50,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ opacity: 0.9 }}>
                    {card.icon}
                  </Box>
                  <Chip
                    label={card.trend}
                    size="small"
                    icon={card.trendUp ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontWeight: 700,
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 0.5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
                  {card.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabela de solicitações recentes - Modernizada */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(232, 117, 58, 0.08) 0%, rgba(211, 94, 40, 0.05) 100%)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Solicitações Recentes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Últimas análises realizadas
                </Typography>
              </Box>
              {recentCredits.length > 0 && (
                <Button 
                  onClick={() => navigate('/historico')}
                  endIcon={<ArrowUpwardIcon sx={{ transform: 'rotate(90deg)' }} />}
                >
                  Ver todas
                </Button>
              )}
            </Box>
          </Box>

          {recentCredits.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'action.hover',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Nenhuma solicitação encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comece criando sua primeira análise de crédito
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/analise')}
              >
                Criar primeira solicitação
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Número</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }} align="center">Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCredits.map((credit) => (
                    <TableRow 
                      key={credit.id} 
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {credit.numeroSolicitacao}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: 'primary.main',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                            }}
                          >
                            {credit.nomeRazaoSocial?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {credit.nomeRazaoSocial}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(credit.valorSolicitado)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={credit.status || 'Rascunho'}
                          color={getStatusColor(credit.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(credit.dataInclusao)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalhes">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(credit)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <CreditDetailsModal
        open={detailsOpen}
        onClose={handleCloseDetails}
        credit={selectedCredit}
      />
    </Box>
  );
}

export default Dashboard;

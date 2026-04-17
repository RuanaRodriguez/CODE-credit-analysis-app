import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCreditContext } from '../contexts/CreditContext';
import { CREDIT_STATUS } from '../types/constants';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#4caf50', '#f57c00', '#d32f2f', '#1976d2'];

function Reports() {
  const { credits } = useCreditContext();
  const [period, setPeriod] = useState('30');
  const [statusData, setStatusData] = useState([]);
  const [valueData, setValueData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    // Dados por status
    const statusCounts = {};
    Object.values(CREDIT_STATUS).forEach(status => {
      statusCounts[status.label] = credits.filter(c => c.status === status.label).length;
    });

    const statusChartData = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));

    setStatusData(statusChartData);

    // Dados por valor
    const ranges = [
      { name: 'Até 10k', min: 0, max: 10000 },
      { name: '10-50k', min: 10000, max: 50000 },
      { name: '50-100k', min: 50000, max: 100000 },
      { name: '100k+', min: 100000, max: Infinity },
    ];

    const valueChartData = ranges.map(range => ({
      name: range.name,
      quantidade: credits.filter(c => 
        c.valorSolicitado >= range.min && c.valorSolicitado < range.max
      ).length,
    }));

    setValueData(valueChartData);

    // Tendência por dia (últimos 7 dias)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      const dayCredits = credits.filter(c => {
        const creditDate = new Date(c.dataInclusao);
        return creditDate.toDateString() === date.toDateString();
      });

      last7Days.push({
        data: dateStr,
        solicitacoes: dayCredits.length,
        valor: dayCredits.reduce((sum, c) => sum + (c.valorSolicitado || 0), 0),
      });
    }

    setTrendData(last7Days);
  }, [credits, period]);

  // Estatísticas gerais
  const totalSolicitacoes = credits.length;
  const valorTotal = credits.reduce((sum, c) => sum + (c.valorSolicitado || 0), 0);
  const valorMedio = totalSolicitacoes > 0 ? valorTotal / totalSolicitacoes : 0;
  const aprovadas = credits.filter(c => c.status === CREDIT_STATUS.APROVADA.label).length;
  const taxaAprovacao = totalSolicitacoes > 0 ? (aprovadas / totalSolicitacoes * 100).toFixed(1) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Relatórios e Análises
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={period}
            label="Período"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="7">Últimos 7 dias</MenuItem>
            <MenuItem value="30">Últimos 30 dias</MenuItem>
            <MenuItem value="90">Últimos 90 dias</MenuItem>
            <MenuItem value="365">Último ano</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Cards de métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body2">
              Total Solicitações
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {totalSolicitacoes}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body2">
              Valor Total
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontSize: '1.8rem' }}>
              {formatCurrency(valorTotal)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body2">
              Valor Médio
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontSize: '1.8rem' }}>
              {formatCurrency(valorMedio)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body2">
              Taxa de Aprovação
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }} color="success.main">
              {taxaAprovacao}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de Pizza - Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Distribuição por Status
              </Typography>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Sem dados disponíveis
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Barras - Valor */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Distribuição por Valor
              </Typography>
              {valueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Sem dados disponíveis
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Linha - Tendência */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tendência de Solicitações (Últimos 7 Dias)
              </Typography>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="solicitacoes" 
                      stroke="#1976d2" 
                      name="Quantidade"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#4caf50" 
                      name="Valor Total (R$)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  Sem dados disponíveis
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCreditContext } from '../contexts/CreditContext';
import { CREDIT_STATUS } from '../types/constants';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import CreditDetailsModal from '../components/common/CreditDetailsModal';

function CreditHistory() {
  const { credits } = useCreditContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    const statusObj = Object.values(CREDIT_STATUS).find(s => s.label === status);
    return statusObj?.color || 'default';
  };

  const handleViewDetails = (credit) => {
    setSelectedCredit(credit);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedCredit(null);
  };

  // Filtrar créditos
  const filteredCredits = credits.filter(credit => {
    const matchesSearch = 
      credit.nomeRazaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.numeroSolicitacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.cpfCnpj?.includes(searchTerm);

    const matchesStatus = 
      statusFilter === 'all' || credit.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginar resultados
  const paginatedCredits = filteredCredits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Histórico de Solicitações
      </Typography>

      <Card>
        <CardContent>
          {/* Filtros */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar por cliente, número ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Todos</MenuItem>
              {Object.values(CREDIT_STATUS).map(status => (
                <MenuItem key={status.value} value={status.label}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Tabela */}
          {filteredCredits.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhuma solicitação encontrada com os filtros aplicados'
                  : 'Nenhuma solicitação encontrada'}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Número</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>CPF/CNPJ</TableCell>
                      <TableCell align="right">Valor Solicitado</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCredits.map((credit) => (
                      <TableRow key={credit.id} hover>
                        <TableCell>{credit.numeroSolicitacao}</TableCell>
                        <TableCell>{formatDateTime(credit.dataInclusao)}</TableCell>
                        <TableCell>{credit.nomeRazaoSocial}</TableCell>
                        <TableCell>{credit.cpfCnpj}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(credit.valorSolicitado)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={credit.status || 'Rascunho'}
                            color={getStatusColor(credit.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(credit)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredCredits.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Linhas por página:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} de ${count}`
                }
              />

      {/* Modal de Detalhes */}
      <CreditDetailsModal
        open={detailsOpen}
        onClose={handleCloseDetails}
        credit={selectedCredit}
      />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreditHistory;

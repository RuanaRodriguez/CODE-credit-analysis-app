import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const drawerWidth = 260;

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/dashboard',
    description: 'Visão geral'
  },
  { 
    text: 'Análise Crédito', 
    icon: <AssessmentIcon />, 
    path: '/analise',
    description: 'Nova análise'
  },
  { 
    text: 'Histórico', 
    icon: <HistoryIcon />, 
    path: '/historico',
    description: 'Ver histórico'
  },
  { 
    text: 'Relatórios', 
    icon: <BarChartIcon />, 
    path: '/relatorios',
    description: 'Métricas e gráficos'
  },
];

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #E8753A 0%, #D35E28 100%)',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ minHeight: 70 }} />
      
      {/* Stats Card */}
      <Box sx={{ px: 2, py: 3 }}>
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 3,
            p: 2,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Performance
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            98.5%
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Taxa de aprovação este mês
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#fff',
                    minWidth: 45,
                    '& .MuiSvgIcon-root': {
                      fontSize: 26,
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Box>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: '0.95rem',
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.8,
                      fontSize: '0.7rem',
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;

import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useState } from 'react';

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      <Sidebar open={drawerOpen} onClose={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '70px',
          ml: drawerOpen ? { xs: 0, sm: '260px' } : 0,
          transition: 'margin 0.3s',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 70px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;

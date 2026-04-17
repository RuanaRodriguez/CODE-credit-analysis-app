import { Routes, Route, Navigate } from 'react-router-dom';
import { CreditProvider } from './contexts/CreditContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CreditAnalysis from './pages/CreditAnalysis';
import CreditHistory from './pages/CreditHistory';
import Reports from './pages/Reports';

function App() {
  return (
    <CreditProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analise" element={<CreditAnalysis />} />
          <Route path="/historico" element={<CreditHistory />} />
          <Route path="/relatorios" element={<Reports />} />
        </Routes>
      </Layout>
    </CreditProvider>
  );
}

export default App;

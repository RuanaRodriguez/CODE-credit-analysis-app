import { createContext, useContext, useState, useEffect } from 'react';

const CreditContext = createContext();

export function CreditProvider({ children }) {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedCredits = localStorage.getItem('credits');
    if (savedCredits) {
      setCredits(JSON.parse(savedCredits));
    }
  }, []);

  // Salvar no localStorage quando credits mudar
  useEffect(() => {
    if (credits.length > 0) {
      localStorage.setItem('credits', JSON.stringify(credits));
    }
  }, [credits]);

  const addCredit = (credit) => {
    const newCredit = {
      ...credit,
      id: `credit-${Date.now()}`,
      dataInclusao: new Date().toISOString(),
      numeroSolicitacao: `SOL-${String(credits.length + 1).padStart(6, '0')}`,
    };
    setCredits(prev => [newCredit, ...prev]);
    return newCredit;
  };

  const updateCredit = (id, updates) => {
    setCredits(prev =>
      prev.map(credit =>
        credit.id === id ? { ...credit, ...updates } : credit
      )
    );
  };

  const deleteCredit = (id) => {
    setCredits(prev => prev.filter(credit => credit.id !== id));
  };

  const getCreditById = (id) => {
    return credits.find(credit => credit.id === id);
  };

  const value = {
    credits,
    loading,
    setLoading,
    addCredit,
    updateCredit,
    deleteCredit,
    getCreditById,
  };

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCreditContext() {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCreditContext must be used within CreditProvider');
  }
  return context;
}

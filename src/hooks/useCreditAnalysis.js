import { useState, useEffect } from 'react';

/**
 * Custom hook para gerenciar dados no localStorage
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {[any, Function]} - [valor, setValor]
 */
export function useLocalStorage(key, initialValue) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Função para setar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função como setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Custom hook para análise de crédito
 * @returns {object} - Métodos e estados da análise
 */
export function useCreditAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async (data) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      // Simula análise
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria chamado o CreditService
      const analysisResult = {
        approved: true,
        score: 750,
        // ... outros dados
      };
      
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setAnalyzing(false);
  };

  return {
    analyzing,
    result,
    error,
    analyze,
    reset,
  };
}

/**
 * Custom hook para validação de formulários
 * @returns {object} - Métodos e estados de validação
 */
export function useValidation() {
  const [errors, setErrors] = useState({});

  const validate = (rules, data) => {
    const newErrors = {};

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];

      if (rule.required && !value) {
        newErrors[field] = rule.message || `${field} é obrigatório`;
      }

      if (rule.validator && value) {
        if (!rule.validator(value)) {
          newErrors[field] = rule.message || `${field} inválido`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAll = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    clearError,
    clearAll,
  };
}

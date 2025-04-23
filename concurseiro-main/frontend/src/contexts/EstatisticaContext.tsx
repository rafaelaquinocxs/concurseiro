import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { estatisticaService } from '../services/estatistica.service';
import { useAuth } from './AuthContext';

// Tipos
interface EstatisticasGerais {
  totalSimulados: number;
  totalQuestoes: number;
  acertos: number;
  erros: number;
  tempoMedio: string;
}

interface EstatisticaMateria {
  id: number;
  nome: string;
  acertos: number;
  total: number;
  tempo: string;
}

interface HistoricoSimulado {
  id: number;
  data: string;
  tipo: string;
  acertos: number;
  total: number;
  tempo: string;
}

interface TodasEstatisticas {
  geral: EstatisticasGerais;
  materias: EstatisticaMateria[];
  historico: HistoricoSimulado[];
}

interface EstatisticaContextType {
  estatisticasGerais: EstatisticasGerais | null;
  estatisticasPorMateria: EstatisticaMateria[];
  historicoSimulados: HistoricoSimulado[];
  loading: boolean;
  error: string | null;
  fetchEstatisticasGerais: () => Promise<void>;
  fetchEstatisticasPorMateria: () => Promise<void>;
  fetchHistoricoSimulados: () => Promise<void>;
  fetchAllEstatisticas: () => Promise<void>;
}

const EstatisticaContext = createContext<EstatisticaContextType | undefined>(undefined);

interface EstatisticaProviderProps {
  children: ReactNode;
}

export const EstatisticaProvider: React.FC<EstatisticaProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [estatisticasGerais, setEstatisticasGerais] = useState<EstatisticasGerais | null>(null);
  const [estatisticasPorMateria, setEstatisticasPorMateria] = useState<EstatisticaMateria[]>([]);
  const [historicoSimulados, setHistoricoSimulados] = useState<HistoricoSimulado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticasGerais = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await estatisticaService.getEstatisticasGerais(user.id);
      setEstatisticasGerais(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar estatísticas gerais');
      console.error('Erro ao buscar estatísticas gerais:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstatisticasPorMateria = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await estatisticaService.getEstatisticasPorMateria(user.id);
      setEstatisticasPorMateria(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar estatísticas por matéria');
      console.error('Erro ao buscar estatísticas por matéria:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricoSimulados = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await estatisticaService.getHistoricoSimulados(user.id);
      setHistoricoSimulados(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar histórico de simulados');
      console.error('Erro ao buscar histórico de simulados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEstatisticas = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await estatisticaService.getAllEstatisticas(user.id);
      setEstatisticasGerais(data.geral);
      setEstatisticasPorMateria(data.materias);
      setHistoricoSimulados(data.historico);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar estatísticas');
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllEstatisticas();
    }
  }, [isAuthenticated, user]);

  return (
    <EstatisticaContext.Provider
      value={{
        estatisticasGerais,
        estatisticasPorMateria,
        historicoSimulados,
        loading,
        error,
        fetchEstatisticasGerais,
        fetchEstatisticasPorMateria,
        fetchHistoricoSimulados,
        fetchAllEstatisticas
      }}
    >
      {children}
    </EstatisticaContext.Provider>
  );
};

export const useEstatistica = (): EstatisticaContextType => {
  const context = useContext(EstatisticaContext);
  if (context === undefined) {
    throw new Error('useEstatistica deve ser usado dentro de um EstatisticaProvider');
  }
  return context;
};

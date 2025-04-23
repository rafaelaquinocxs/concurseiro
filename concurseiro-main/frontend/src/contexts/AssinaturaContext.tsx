import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { assinaturaService } from '../services/assinatura.service';
import { useAuth } from './AuthContext';

// Tipos
interface Plano {
  id: string;
  titulo: string;
  preco: number;
  periodo: string;
  descricao: string;
  recursos: string[];
  recomendado?: boolean;
}

interface Assinatura {
  id: string;
  userId: string;
  planoId: string;
  status: string;
  dataInicio: Date;
  dataFim: Date;
  valorPago: number;
  metodoPagamento: string;
  plano?: Plano;
}

interface AssinaturaContextType {
  planos: Plano[];
  assinaturaAtual: Assinatura | null;
  planoSelecionado: string | null;
  loading: boolean;
  error: string | null;
  fetchPlanos: () => Promise<void>;
  fetchAssinaturaUsuario: () => Promise<void>;
  selecionarPlano: (planoId: string) => void;
  criarAssinatura: (metodoPagamento: string) => Promise<void>;
  cancelarAssinatura: () => Promise<void>;
}

const AssinaturaContext = createContext<AssinaturaContextType | undefined>(undefined);

interface AssinaturaProviderProps {
  children: ReactNode;
}

export const AssinaturaProvider: React.FC<AssinaturaProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [assinaturaAtual, setAssinaturaAtual] = useState<Assinatura | null>(null);
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assinaturaService.getPlanos();
      setPlanos(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar planos');
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssinaturaUsuario = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await assinaturaService.getAssinaturaUsuario(user.id);
      setAssinaturaAtual(data);
    } catch (error: any) {
      // Se o erro for 404, significa que o usuário não tem assinatura
      if (error.response?.status === 404) {
        setAssinaturaAtual(null);
      } else {
        setError(error.response?.data?.message || 'Erro ao buscar assinatura');
        console.error('Erro ao buscar assinatura:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const selecionarPlano = (planoId: string) => {
    setPlanoSelecionado(planoId);
  };

  const criarAssinatura = async (metodoPagamento: string) => {
    if (!user || !planoSelecionado) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await assinaturaService.criarAssinatura({
        userId: user.id,
        planoId: planoSelecionado,
        metodoPagamento
      });
      setAssinaturaAtual(data);
      setPlanoSelecionado(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar assinatura');
      console.error('Erro ao criar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarAssinatura = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await assinaturaService.cancelarAssinatura(user.id);
      setAssinaturaAtual(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao cancelar assinatura');
      console.error('Erro ao cancelar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar planos ao montar o componente
  useEffect(() => {
    fetchPlanos();
  }, []);

  // Carregar assinatura quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAssinaturaUsuario();
    }
  }, [isAuthenticated, user]);

  return (
    <AssinaturaContext.Provider
      value={{
        planos,
        assinaturaAtual,
        planoSelecionado,
        loading,
        error,
        fetchPlanos,
        fetchAssinaturaUsuario,
        selecionarPlano,
        criarAssinatura,
        cancelarAssinatura
      }}
    >
      {children}
    </AssinaturaContext.Provider>
  );
};

export const useAssinatura = (): AssinaturaContextType => {
  const context = useContext(AssinaturaContext);
  if (context === undefined) {
    throw new Error('useAssinatura deve ser usado dentro de um AssinaturaProvider');
  }
  return context;
};

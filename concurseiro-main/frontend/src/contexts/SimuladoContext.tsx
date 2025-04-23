import React, { createContext, useContext, useState, ReactNode } from 'react';
import { simuladoService } from '../services/simulado.service';

// Tipos
interface Simulado {
  id: string;
  titulo: string;
  descricao: string;
  materias: string[];
  quantidadeQuestoes: number;
  tempoDuracao: number;
}

interface Questao {
  id: string;
  texto: string;
  opcoes: string[];
  materia: string;
}

interface SimuladoDetalhado {
  id: string;
  titulo: string;
  tempoDuracao: number;
  questoes: Questao[];
}

interface Resposta {
  questaoId: string;
  resposta: number;
}

interface ResultadoSimulado {
  simuladoId: string;
  titulo: string;
  totalQuestoes: number;
  acertos: number;
  percentualAcertos: number;
  tempoGasto: number;
  resultadoDetalhado: {
    questaoId: string;
    acertou: boolean;
    respostaUsuario: number;
    respostaCorreta: number;
    explicacao: string;
  }[];
}

interface SimuladoContextType {
  simulados: Simulado[];
  simuladoAtual: SimuladoDetalhado | null;
  respostas: Resposta[];
  resultado: ResultadoSimulado | null;
  loading: boolean;
  error: string | null;
  fetchSimulados: () => Promise<void>;
  iniciarSimulado: (id: string) => Promise<void>;
  responderQuestao: (questaoId: string, resposta: number) => void;
  submeterRespostas: (tempoGasto: number) => Promise<void>;
  limparSimuladoAtual: () => void;
}

const SimuladoContext = createContext<SimuladoContextType | undefined>(undefined);

interface SimuladoProviderProps {
  children: ReactNode;
}

export const SimuladoProvider: React.FC<SimuladoProviderProps> = ({ children }) => {
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [simuladoAtual, setSimuladoAtual] = useState<SimuladoDetalhado | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [resultado, setResultado] = useState<ResultadoSimulado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimulados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await simuladoService.getSimulados();
      setSimulados(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao buscar simulados');
      console.error('Erro ao buscar simulados:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarSimulado = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setRespostas([]);
      setResultado(null);
      const data = await simuladoService.iniciarSimulado(id);
      setSimuladoAtual(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao iniciar simulado');
      console.error('Erro ao iniciar simulado:', error);
    } finally {
      setLoading(false);
    }
  };

  const responderQuestao = (questaoId: string, resposta: number) => {
    // Verificar se já existe uma resposta para esta questão
    const respostaExistente = respostas.find(r => r.questaoId === questaoId);
    
    if (respostaExistente) {
      // Atualizar resposta existente
      setRespostas(prev => 
        prev.map(r => r.questaoId === questaoId ? { ...r, resposta } : r)
      );
    } else {
      // Adicionar nova resposta
      setRespostas(prev => [...prev, { questaoId, resposta }]);
    }
  };

  const submeterRespostas = async (tempoGasto: number) => {
    if (!simuladoAtual) {
      setError('Nenhum simulado em andamento');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await simuladoService.submeterRespostas(simuladoAtual.id, respostas, tempoGasto);
      setResultado(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao submeter respostas');
      console.error('Erro ao submeter respostas:', error);
    } finally {
      setLoading(false);
    }
  };

  const limparSimuladoAtual = () => {
    setSimuladoAtual(null);
    setRespostas([]);
    setResultado(null);
  };

  return (
    <SimuladoContext.Provider
      value={{
        simulados,
        simuladoAtual,
        respostas,
        resultado,
        loading,
        error,
        fetchSimulados,
        iniciarSimulado,
        responderQuestao,
        submeterRespostas,
        limparSimuladoAtual
      }}
    >
      {children}
    </SimuladoContext.Provider>
  );
};

export const useSimulado = (): SimuladoContextType => {
  const context = useContext(SimuladoContext);
  if (context === undefined) {
    throw new Error('useSimulado deve ser usado dentro de um SimuladoProvider');
  }
  return context;
};

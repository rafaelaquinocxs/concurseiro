import api from './api';

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

// Serviços de estatísticas
export const estatisticaService = {
  // Obter estatísticas gerais do usuário
  getEstatisticasGerais: async (userId: string): Promise<EstatisticasGerais> => {
    const response = await api.get(`/estatisticas/usuario/${userId}/geral`);
    return response.data.estatisticas;
  },

  // Obter estatísticas por matéria
  getEstatisticasPorMateria: async (userId: string): Promise<EstatisticaMateria[]> => {
    const response = await api.get(`/estatisticas/usuario/${userId}/materias`);
    return response.data.estatisticas;
  },

  // Obter histórico de simulados
  getHistoricoSimulados: async (userId: string): Promise<HistoricoSimulado[]> => {
    const response = await api.get(`/estatisticas/usuario/${userId}/historico`);
    return response.data.historico;
  },

  // Obter todas as estatísticas
  getAllEstatisticas: async (userId: string): Promise<TodasEstatisticas> => {
    const response = await api.get(`/estatisticas/usuario/${userId}`);
    return response.data.estatisticas;
  }
};

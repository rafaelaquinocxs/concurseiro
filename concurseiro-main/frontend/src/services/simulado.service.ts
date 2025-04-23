import api from './api';

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

// Serviços de simulados
export const simuladoService = {
  // Obter todos os simulados
  getSimulados: async (): Promise<Simulado[]> => {
    const response = await api.get('/simulados');
    return response.data.simulados;
  },

  // Obter um simulado específico
  getSimulado: async (id: string): Promise<Simulado> => {
    const response = await api.get(`/simulados/${id}`);
    return response.data.simulado;
  },

  // Iniciar um simulado
  iniciarSimulado: async (id: string): Promise<SimuladoDetalhado> => {
    const response = await api.get(`/simulados/${id}/iniciar`);
    return response.data;
  },

  // Submeter respostas de um simulado
  submeterRespostas: async (id: string, respostas: Resposta[], tempoGasto: number): Promise<ResultadoSimulado> => {
    const response = await api.post(`/simulados/${id}/submeter`, { respostas, tempoGasto });
    return response.data.resultado;
  }
};

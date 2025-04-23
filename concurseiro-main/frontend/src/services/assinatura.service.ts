import api from './api';

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

interface NovaAssinatura {
  userId: string;
  planoId: string;
  metodoPagamento: string;
}

// Serviços de assinatura
export const assinaturaService = {
  // Obter todos os planos disponíveis
  getPlanos: async (): Promise<Plano[]> => {
    const response = await api.get('/assinaturas/planos');
    return response.data.planos;
  },

  // Obter um plano específico
  getPlano: async (id: string): Promise<Plano> => {
    const response = await api.get(`/assinaturas/planos/${id}`);
    return response.data.plano;
  },

  // Obter assinatura do usuário
  getAssinaturaUsuario: async (userId: string): Promise<Assinatura> => {
    const response = await api.get(`/assinaturas/usuario/${userId}`);
    return response.data.assinatura;
  },

  // Criar nova assinatura
  criarAssinatura: async (data: NovaAssinatura): Promise<Assinatura> => {
    const response = await api.post('/assinaturas', data);
    return response.data.assinatura;
  },

  // Cancelar assinatura
  cancelarAssinatura: async (userId: string): Promise<Assinatura> => {
    const response = await api.put(`/assinaturas/usuario/${userId}/cancelar`);
    return response.data.assinatura;
  }
};

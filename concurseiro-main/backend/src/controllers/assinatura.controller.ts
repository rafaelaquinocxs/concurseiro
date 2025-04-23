import { Request, Response } from 'express';

// Mock de planos de assinatura para desenvolvimento
const planos = [
  {
    id: 'mensal',
    titulo: 'Mensal',
    preco: 49,
    periodo: 'mensal',
    descricao: 'Acesso a todos os recursos por um mês',
    recursos: [
      'Acesso a todos os simulados',
      'Estatísticas básicas',
      'Suporte por email',
      'Acesso a materiais de estudo',
    ]
  },
  {
    id: 'trimestral',
    titulo: 'Trimestral',
    preco: 129,
    periodo: 'trimestral',
    descricao: 'Acesso a todos os recursos por três meses',
    recursos: [
      'Acesso a todos os simulados',
      'Estatísticas avançadas',
      'Suporte prioritário',
      'Acesso a materiais de estudo',
      'Mapas mentais exclusivos',
    ],
    recomendado: true
  },
  {
    id: 'anual',
    titulo: 'Anual',
    preco: 399,
    periodo: 'anual',
    descricao: 'Acesso a todos os recursos por um ano',
    recursos: [
      'Acesso a todos os simulados',
      'Estatísticas avançadas',
      'Suporte prioritário 24/7',
      'Acesso a materiais de estudo',
      'Mapas mentais exclusivos',
      'Simulados personalizados',
      'Acesso a aulas ao vivo',
    ]
  }
];

// Mock de assinaturas de usuários
const assinaturas = [
  {
    id: '1',
    userId: '1',
    planoId: 'trimestral',
    status: 'ativa',
    dataInicio: new Date('2025-04-15'),
    dataFim: new Date('2025-07-15'),
    valorPago: 129,
    metodoPagamento: 'Cartão de crédito terminado em 1234'
  }
];

// Obter todos os planos disponíveis
export const getPlanos = async (req: Request, res: Response) => {
  try {
    res.json({ planos });
  } catch (error) {
    console.error('Erro ao obter planos:', error);
    res.status(500).json({ message: 'Erro ao obter planos' });
  }
};

// Obter um plano específico
export const getPlano = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const plano = planos.find(p => p.id === id);
    if (!plano) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    res.json({ plano });
  } catch (error) {
    console.error('Erro ao obter plano:', error);
    res.status(500).json({ message: 'Erro ao obter plano' });
  }
};

// Obter assinatura do usuário
export const getAssinaturaUsuario = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const assinatura = assinaturas.find(a => a.userId === userId);
    if (!assinatura) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }

    // Obter detalhes do plano
    const plano = planos.find(p => p.id === assinatura.planoId);

    res.json({ 
      assinatura: {
        ...assinatura,
        plano
      } 
    });
  } catch (error) {
    console.error('Erro ao obter assinatura:', error);
    res.status(500).json({ message: 'Erro ao obter assinatura' });
  }
};

// Criar nova assinatura
export const criarAssinatura = async (req: Request, res: Response) => {
  try {
    const { userId, planoId, metodoPagamento } = req.body;
    
    // Verificar se o plano existe
    const plano = planos.find(p => p.id === planoId);
    if (!plano) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    // Verificar se o usuário já tem uma assinatura ativa
    const assinaturaExistente = assinaturas.find(a => a.userId === userId && a.status === 'ativa');
    if (assinaturaExistente) {
      return res.status(400).json({ message: 'Usuário já possui uma assinatura ativa' });
    }

    // Calcular data de fim com base no período
    const dataInicio = new Date();
    const dataFim = new Date(dataInicio);
    
    if (plano.periodo === 'mensal') {
      dataFim.setMonth(dataFim.getMonth() + 1);
    } else if (plano.periodo === 'trimestral') {
      dataFim.setMonth(dataFim.getMonth() + 3);
    } else if (plano.periodo === 'anual') {
      dataFim.setFullYear(dataFim.getFullYear() + 1);
    }

    // Criar nova assinatura
    const novaAssinatura = {
      id: (assinaturas.length + 1).toString(),
      userId,
      planoId,
      status: 'ativa',
      dataInicio,
      dataFim,
      valorPago: plano.preco,
      metodoPagamento
    };

    // Adicionar assinatura ao array (em produção, seria salvo no banco de dados)
    assinaturas.push(novaAssinatura);

    res.status(201).json({ 
      message: 'Assinatura criada com sucesso',
      assinatura: {
        ...novaAssinatura,
        plano
      }
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ message: 'Erro ao criar assinatura' });
  }
};

// Cancelar assinatura
export const cancelarAssinatura = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const assinaturaIndex = assinaturas.findIndex(a => a.userId === userId && a.status === 'ativa');
    if (assinaturaIndex === -1) {
      return res.status(404).json({ message: 'Assinatura ativa não encontrada' });
    }

    // Atualizar status da assinatura
    assinaturas[assinaturaIndex] = {
      ...assinaturas[assinaturaIndex],
      status: 'cancelada'
    };

    res.json({ 
      message: 'Assinatura cancelada com sucesso',
      assinatura: assinaturas[assinaturaIndex]
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ message: 'Erro ao cancelar assinatura' });
  }
};

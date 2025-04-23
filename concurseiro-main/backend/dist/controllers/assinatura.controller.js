"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarAssinatura = exports.criarAssinatura = exports.getAssinaturaUsuario = exports.getPlano = exports.getPlanos = void 0;
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
const getPlanos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ planos });
    }
    catch (error) {
        console.error('Erro ao obter planos:', error);
        res.status(500).json({ message: 'Erro ao obter planos' });
    }
});
exports.getPlanos = getPlanos;
// Obter um plano específico
const getPlano = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const plano = planos.find(p => p.id === id);
        if (!plano) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }
        res.json({ plano });
    }
    catch (error) {
        console.error('Erro ao obter plano:', error);
        res.status(500).json({ message: 'Erro ao obter plano' });
    }
});
exports.getPlano = getPlano;
// Obter assinatura do usuário
const getAssinaturaUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const assinatura = assinaturas.find(a => a.userId === userId);
        if (!assinatura) {
            return res.status(404).json({ message: 'Assinatura não encontrada' });
        }
        // Obter detalhes do plano
        const plano = planos.find(p => p.id === assinatura.planoId);
        res.json({
            assinatura: Object.assign(Object.assign({}, assinatura), { plano })
        });
    }
    catch (error) {
        console.error('Erro ao obter assinatura:', error);
        res.status(500).json({ message: 'Erro ao obter assinatura' });
    }
});
exports.getAssinaturaUsuario = getAssinaturaUsuario;
// Criar nova assinatura
const criarAssinatura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else if (plano.periodo === 'trimestral') {
            dataFim.setMonth(dataFim.getMonth() + 3);
        }
        else if (plano.periodo === 'anual') {
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
            assinatura: Object.assign(Object.assign({}, novaAssinatura), { plano })
        });
    }
    catch (error) {
        console.error('Erro ao criar assinatura:', error);
        res.status(500).json({ message: 'Erro ao criar assinatura' });
    }
});
exports.criarAssinatura = criarAssinatura;
// Cancelar assinatura
const cancelarAssinatura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const assinaturaIndex = assinaturas.findIndex(a => a.userId === userId && a.status === 'ativa');
        if (assinaturaIndex === -1) {
            return res.status(404).json({ message: 'Assinatura ativa não encontrada' });
        }
        // Atualizar status da assinatura
        assinaturas[assinaturaIndex] = Object.assign(Object.assign({}, assinaturas[assinaturaIndex]), { status: 'cancelada' });
        res.json({
            message: 'Assinatura cancelada com sucesso',
            assinatura: assinaturas[assinaturaIndex]
        });
    }
    catch (error) {
        console.error('Erro ao cancelar assinatura:', error);
        res.status(500).json({ message: 'Erro ao cancelar assinatura' });
    }
});
exports.cancelarAssinatura = cancelarAssinatura;

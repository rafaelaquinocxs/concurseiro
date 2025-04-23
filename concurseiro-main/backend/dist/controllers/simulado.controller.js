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
exports.submeterRespostas = exports.iniciarSimulado = exports.getSimulado = exports.getSimulados = void 0;
// Mock de simulados para desenvolvimento
const simulados = [
    {
        id: '1',
        titulo: 'Simulado Completo',
        descricao: 'Simulado com questões de todas as matérias',
        materias: ['Direito Constitucional', 'Direito Administrativo', 'Português', 'Raciocínio Lógico'],
        questoes: [
            {
                id: '1',
                texto: 'De acordo com a Constituição Federal, são direitos sociais, EXCETO:',
                opcoes: [
                    'Educação e saúde',
                    'Alimentação e trabalho',
                    'Propriedade privada',
                    'Moradia e transporte',
                    'Lazer e segurança'
                ],
                respostaCorreta: 2,
                materia: 'Direito Constitucional',
                explicacao: 'A propriedade privada é um direito individual, previsto no art. 5º, XXII, da CF/88, e não um direito social. Os direitos sociais estão previstos no art. 6º da CF/88.'
            },
            {
                id: '2',
                texto: 'Sobre os princípios da Administração Pública, é correto afirmar que:',
                opcoes: [
                    'O princípio da legalidade permite ao administrador público fazer tudo aquilo que a lei não proíbe',
                    'O princípio da impessoalidade impede a promoção pessoal de autoridades ou servidores públicos',
                    'O princípio da moralidade não possui aplicação prática, sendo apenas uma diretriz teórica',
                    'O princípio da publicidade é absoluto, não comportando exceções',
                    'O princípio da eficiência foi revogado pela Emenda Constitucional nº 45/2004'
                ],
                respostaCorreta: 1,
                materia: 'Direito Administrativo',
                explicacao: 'O princípio da impessoalidade impede a promoção pessoal de autoridades ou servidores públicos, conforme previsto no art. 37, §1º, da CF/88.'
            }
        ],
        tempoDuracao: 3600,
        createdAt: new Date()
    }
];
// Obter todos os simulados
const getSimulados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Em uma implementação real, buscaríamos do banco de dados
        // Aqui retornamos apenas informações básicas, sem as questões
        const simuladosBasicos = simulados.map(simulado => ({
            id: simulado.id,
            titulo: simulado.titulo,
            descricao: simulado.descricao,
            materias: simulado.materias,
            quantidadeQuestoes: simulado.questoes.length,
            tempoDuracao: simulado.tempoDuracao
        }));
        res.json({ simulados: simuladosBasicos });
    }
    catch (error) {
        console.error('Erro ao obter simulados:', error);
        res.status(500).json({ message: 'Erro ao obter simulados' });
    }
});
exports.getSimulados = getSimulados;
// Obter um simulado específico
const getSimulado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const simulado = simulados.find(s => s.id === id);
        if (!simulado) {
            return res.status(404).json({ message: 'Simulado não encontrado' });
        }
        res.json({ simulado });
    }
    catch (error) {
        console.error('Erro ao obter simulado:', error);
        res.status(500).json({ message: 'Erro ao obter simulado' });
    }
});
exports.getSimulado = getSimulado;
// Iniciar um simulado (retorna apenas as perguntas, sem as respostas)
const iniciarSimulado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const simulado = simulados.find(s => s.id === id);
        if (!simulado) {
            return res.status(404).json({ message: 'Simulado não encontrado' });
        }
        // Retornar apenas as perguntas, sem as respostas corretas
        const questoesSemRespostas = simulado.questoes.map(questao => ({
            id: questao.id,
            texto: questao.texto,
            opcoes: questao.opcoes,
            materia: questao.materia
        }));
        res.json({
            id: simulado.id,
            titulo: simulado.titulo,
            tempoDuracao: simulado.tempoDuracao,
            questoes: questoesSemRespostas
        });
    }
    catch (error) {
        console.error('Erro ao iniciar simulado:', error);
        res.status(500).json({ message: 'Erro ao iniciar simulado' });
    }
});
exports.iniciarSimulado = iniciarSimulado;
// Submeter respostas de um simulado
const submeterRespostas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { respostas, tempoGasto } = req.body;
        const simulado = simulados.find(s => s.id === id);
        if (!simulado) {
            return res.status(404).json({ message: 'Simulado não encontrado' });
        }
        // Calcular resultado
        let acertos = 0;
        const resultadoDetalhado = simulado.questoes.map(questao => {
            var _a;
            const respostaUsuario = (_a = respostas.find((r) => r.questaoId === questao.id)) === null || _a === void 0 ? void 0 : _a.resposta;
            const acertou = respostaUsuario === questao.respostaCorreta;
            if (acertou) {
                acertos++;
            }
            return {
                questaoId: questao.id,
                acertou,
                respostaUsuario,
                respostaCorreta: questao.respostaCorreta,
                explicacao: questao.explicacao
            };
        });
        const resultado = {
            simuladoId: simulado.id,
            titulo: simulado.titulo,
            totalQuestoes: simulado.questoes.length,
            acertos,
            percentualAcertos: Math.round((acertos / simulado.questoes.length) * 100),
            tempoGasto,
            resultadoDetalhado
        };
        // Em uma implementação real, salvaríamos o resultado no banco de dados
        res.json({ resultado });
    }
    catch (error) {
        console.error('Erro ao submeter respostas:', error);
        res.status(500).json({ message: 'Erro ao submeter respostas' });
    }
});
exports.submeterRespostas = submeterRespostas;

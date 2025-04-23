"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const simulado_routes_1 = __importDefault(require("./routes/simulado.routes"));
const estatistica_routes_1 = __importDefault(require("./routes/estatistica.routes"));
const assinatura_routes_1 = __importDefault(require("./routes/assinatura.routes"));
// Configuração das variáveis de ambiente
dotenv_1.default.config();
// Inicialização do app Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Conexão com o banco de dados (mock para desenvolvimento)
// Em produção, usaríamos uma string de conexão real do MongoDB
const mockDBConnection = () => {
    console.log('Conexão com banco de dados simulada com sucesso');
};
mockDBConnection();
// Rotas
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/simulados', simulado_routes_1.default);
app.use('/api/estatisticas', estatistica_routes_1.default);
app.use('/api/assinaturas', assinatura_routes_1.default);
// Rota básica para teste
app.get('/', (req, res) => {
    res.json({ message: 'API da plataforma RAFA está funcionando!' });
});
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

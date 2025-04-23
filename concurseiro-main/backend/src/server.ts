import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import simuladoRoutes from './routes/simulado.routes';
import estatisticaRoutes from './routes/estatistica.routes';
import assinaturaRoutes from './routes/assinatura.routes';

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização do app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados (mock para desenvolvimento)
// Em produção, usaríamos uma string de conexão real do MongoDB
const mockDBConnection = () => {
  console.log('Conexão com banco de dados simulada com sucesso');
};

mockDBConnection();

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/simulados', simuladoRoutes);
app.use('/api/estatisticas', estatisticaRoutes);
app.use('/api/assinaturas', assinaturaRoutes);

// Rota básica para teste
app.get('/', (req, res) => {
  res.json({ message: 'API da plataforma RAFA está funcionando!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

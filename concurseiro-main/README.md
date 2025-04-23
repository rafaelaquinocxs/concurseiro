# RAFA - Plataforma Educacional para Concursos

Este é o repositório da plataforma RAFA, uma aplicação web completa para alunos de concursos públicos.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Desenvolvido com React, TypeScript e TailwindCSS
- **Backend**: Desenvolvido com Node.js, Express e TypeScript

## Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- TailwindCSS
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express
- TypeScript
- JWT para autenticação
- Mock de dados (substituível por MongoDB)

## Funcionalidades

- Sistema de autenticação (login/registro)
- Dashboard com estatísticas
- Simulados com temporizador
- Estatísticas de desempenho
- Sistema de assinaturas
- Gerenciamento de conta

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v14+)
- npm ou yarn

### Instalação e Execução

1. Clone o repositório:
```
git clone https://github.com/seu-usuario/rafa-platform.git
cd rafa-platform
```

2. Instale as dependências do frontend:
```
cd frontend
npm install
```

3. Instale as dependências do backend:
```
cd ../backend
npm install
```

4. Execute o backend:
```
npm run dev
```

5. Em outro terminal, execute o frontend:
```
cd ../frontend
npm start
```

6. Acesse a aplicação em `http://localhost:3000`

## Estrutura de Diretórios

### Frontend
- `/src/components`: Componentes reutilizáveis
- `/src/pages`: Páginas da aplicação
- `/src/contexts`: Contextos para gerenciamento de estado
- `/src/services`: Serviços para comunicação com a API

### Backend
- `/src/controllers`: Controladores para cada recurso
- `/src/routes`: Rotas da API
- `/src/middleware`: Middlewares (autenticação, etc.)
- `/src/models`: Modelos de dados (para uso com MongoDB)

## Deploy

A aplicação está disponível online em:
- Frontend: [https://rafa-platform.vercel.app](https://rafa-platform.vercel.app)
- Backend: [https://rafa-platform-api.vercel.app](https://rafa-platform-api.vercel.app)

## Licença

Este projeto está licenciado sob a licença MIT.

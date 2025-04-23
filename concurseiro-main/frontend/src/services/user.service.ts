import api from './api';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

// Serviços de usuário
export const userService = {
  // Obter todos os usuários (apenas para admin)
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.users;
  },

  // Obter um usuário específico
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  },

  // Atualizar um usuário
  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  },

  // Excluir um usuário
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};

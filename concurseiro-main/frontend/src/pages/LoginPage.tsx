import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começa a digitar
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }
    
    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      valid = false;
    }
    
    // Validações adicionais para cadastro
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório';
        valid = false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (isLogin) {
          await login(formData.email, formData.password);
        } else {
          await register(formData.name, formData.email, formData.password);
        }
        navigate('/dashboard');
      } catch (err) {
        console.error('Erro de autenticação:', err);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Limpar erros ao alternar entre formulários
    setFormErrors({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
        <Card className="w-full">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                label="Nome completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                error={formErrors.name}
                required
              />
            )}
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              error={formErrors.email}
              required
            />
            
            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              error={formErrors.password}
              required
            />
            
            {!isLogin && (
              <Input
                label="Confirmar senha"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                error={formErrors.confirmPassword}
                required
              />
            )}
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              className="mt-4"
              disabled={loading}
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleForm}
              className="text-primary hover:text-primary-dark font-medium"
              disabled={loading}
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAssinatura } from '../contexts/AssinaturaContext';
import { userService } from '../services/user.service';
import { useNavigate } from 'react-router-dom';

const ConfiguracoesPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { assinaturaAtual, cancelarAssinatura, loading: assinaturaLoading } = useAssinatura();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('perfil');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Preencher dados do usuário
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpar mensagem de sucesso
    if (success) {
      setSuccess('');
    }
  };

  const validatePerfilForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
      valid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const validateSenhaForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
      valid = false;
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
      valid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
      valid = false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePerfilForm() && user) {
      try {
        setLoading(true);
        await userService.updateUser(user.id, {
          name: formData.name,
          email: formData.email
        });
        setSuccess('Perfil atualizado com sucesso!');
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          email: error.response?.data?.message || 'Erro ao atualizar perfil'
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangeSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateSenhaForm()) {
      try {
        setLoading(true);
        // Em uma implementação real, chamaríamos uma API para alterar a senha
        // Aqui vamos apenas simular o sucesso
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('Senha alterada com sucesso!');
        
        // Limpar campos de senha
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Senha atual incorreta'
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelAssinatura = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso até o final do período pago.'
    );
    
    if (confirmed) {
      try {
        await cancelarAssinatura();
        setSuccess('Assinatura cancelada com sucesso!');
      } catch (error) {
        console.error('Erro ao cancelar assinatura:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'
    );
    
    if (confirmed && user) {
      try {
        setLoading(true);
        await userService.deleteUser(user.id);
        logout();
        navigate('/');
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPerfilTab = () => {
    return (
      <Card>
        <form onSubmit={handleSavePerfil} className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          <Input
            label="Nome completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <div className="mt-6">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const renderSenhaTab = () => {
    return (
      <Card>
        <form onSubmit={handleChangeSenha} className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Alterar Senha</h2>
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          <Input
            label="Senha atual"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            required
          />
          
          <Input
            label="Nova senha"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
          />
          
          <Input
            label="Confirmar nova senha"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          
          <div className="mt-6">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  const renderAssinaturaTab = () => {
    return (
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes da Assinatura</h2>
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          {assinaturaLoading ? (
            <p className="text-gray-500 text-center py-4">Carregando informações da assinatura...</p>
          ) : assinaturaAtual ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{assinaturaAtual.plano?.titulo || 'Plano'}</h3>
                    <p className="text-gray-600">
                      Renovação em: {new Date(assinaturaAtual.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assinaturaAtual.status === 'ativa' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assinaturaAtual.status === 'ativa' ? 'Ativa' : 'Cancelada'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Valor da assinatura</span>
                  <span className="font-medium">R${assinaturaAtual.valorPago.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Método de pagamento</span>
                  <span className="font-medium">{assinaturaAtual.metodoPagamento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Data de início</span>
                  <span className="font-medium">{new Date(assinaturaAtual.dataInicio).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Próxima cobrança</span>
                  <span className="font-medium">{new Date(assinaturaAtual.dataFim).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              {assinaturaAtual.status === 'ativa' && (
                <div className="mt-6 flex space-x-4">
                  <Button variant="outline" onClick={() => navigate('/planos')}>
                    Alterar plano
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleCancelAssinatura}
                    disabled={assinaturaLoading}
                  >
                    {assinaturaLoading ? 'Processando...' : 'Cancelar assinatura'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Você não possui uma assinatura ativa.</p>
              <Button variant="primary" onClick={() => navigate('/planos')}>
                Ver planos disponíveis
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderContaTab = () => {
    return (
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Gerenciar Conta</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Exportar Dados</h3>
              <p className="text-gray-600 mb-4">
                Baixe uma cópia de todos os seus dados, incluindo histórico de simulados e estatísticas.
              </p>
              <Button variant="outline">
                Exportar meus dados
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-red-600 mb-2">Excluir Conta</h3>
              <p className="text-gray-600 mb-4">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
              </p>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Excluir minha conta'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Conta</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <Card>
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'perfil'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Perfil
                </button>
                
                <button
                  onClick={() => setActiveTab('senha')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'senha'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Alterar Senha
                </button>
                
                <button
                  onClick={() => setActiveTab('assinatura')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'assinatura'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Assinatura
                </button>
                
                <button
                  onClick={() => setActiveTab('conta')}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'conta'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Gerenciar Conta
                </button>
              </nav>
            </Card>
          </div>
          
          <div className="flex-1">
            {activeTab === 'perfil' && renderPerfilTab()}
            {activeTab === 'senha' && renderSenhaTab()}
            {activeTab === 'assinatura' && renderAssinaturaTab()}
            {activeTab === 'conta' && renderContaTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;

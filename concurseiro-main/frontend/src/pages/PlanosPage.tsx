import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAssinatura } from '../contexts/AssinaturaContext';
import { useNavigate } from 'react-router-dom';

const PlanosPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    planos, 
    assinaturaAtual, 
    planoSelecionado, 
    loading, 
    error, 
    fetchPlanos, 
    fetchAssinaturaUsuario, 
    selecionarPlano, 
    criarAssinatura 
  } = useAssinatura();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlanos();
    
    if (isAuthenticated && user) {
      fetchAssinaturaUsuario();
    }
  }, [fetchPlanos, fetchAssinaturaUsuario, isAuthenticated, user]);

  const handleSelectPlan = (planoId: string) => {
    selecionarPlano(planoId);
  };

  const handleSubscribe = () => {
    if (!planoSelecionado) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Em uma implementação real, aqui abriríamos um modal de pagamento
    // Para este exemplo, vamos simular um pagamento com cartão
    criarAssinatura('Cartão de crédito terminado em 1234');
  };

  // Se o usuário já tem uma assinatura ativa, mostrar detalhes
  if (assinaturaAtual && assinaturaAtual.status === 'ativa') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isAuthenticated} />
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sua Assinatura</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Você já possui uma assinatura ativa na plataforma
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes da Assinatura</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{assinaturaAtual.plano?.titulo || 'Plano'}</h3>
                    <p className="text-gray-600">
                      Renovação em: {new Date(assinaturaAtual.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Ativa
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
              
              <div className="mt-6 flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/configuracoes')}>
                  Gerenciar assinatura
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isAuthenticated} />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Planos de Assinatura</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para sua preparação e comece a estudar hoje mesmo
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando planos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {planos.map((plano) => (
                <div key={plano.id} className="relative">
                  {plano.recomendado && (
                    <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                      <div className="bg-primary text-white text-sm font-medium py-1 px-3 rounded-full inline-block">
                        Mais Popular
                      </div>
                    </div>
                  )}
                  
                  <Card className={`h-full flex flex-col ${plano.recomendado ? 'border-2 border-primary shadow-lg' : ''}`}>
                    <div className="p-6 flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{plano.titulo}</h2>
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold text-gray-900">R${plano.preco}</span>
                        <span className="text-gray-500 ml-1">/{plano.periodo}</span>
                      </div>
                      
                      <ul className="space-y-3 mb-6">
                        {plano.recursos.map((recurso, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{recurso}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      <Button
                        variant={planoSelecionado === plano.id ? 'primary' : 'outline'}
                        fullWidth
                        onClick={() => handleSelectPlan(plano.id)}
                      >
                        {planoSelecionado === plano.id ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            
            {planoSelecionado && (
              <div className="mt-12 text-center">
                <Button variant="primary" onClick={handleSubscribe} className="px-8 py-3 text-lg">
                  Assinar Agora
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  Ao assinar, você concorda com nossos termos de serviço e política de privacidade.
                </p>
              </div>
            )}
            
            <div className="mt-16 bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Como funciona a assinatura?</h3>
                  <p className="text-gray-700">
                    Após a assinatura, você terá acesso imediato a todos os recursos incluídos no seu plano. A cobrança será feita de acordo com a periodicidade escolhida (mensal, trimestral ou anual).
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Posso cancelar a qualquer momento?</h3>
                  <p className="text-gray-700">
                    Sim, você pode cancelar sua assinatura a qualquer momento. O acesso aos recursos continuará disponível até o final do período pago.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Existe algum período de teste?</h3>
                  <p className="text-gray-700">
                    Oferecemos um período de teste de 7 dias para novos usuários. Durante esse período, você terá acesso a todos os recursos do plano Trimestral.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Como posso obter suporte?</h3>
                  <p className="text-gray-700">
                    Oferecemos suporte por email para todos os planos. Os planos Trimestral e Anual incluem suporte prioritário, e o plano Anual oferece suporte 24/7.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanosPage;

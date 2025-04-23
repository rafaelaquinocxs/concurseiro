import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { useEstatistica } from '../contexts/EstatisticaContext';
import { useSimulado } from '../contexts/SimuladoContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { estatisticasGerais, historicoSimulados, loading: loadingEstatisticas, fetchAllEstatisticas } = useEstatistica();
  const { fetchSimulados, simulados, loading: loadingSimulados } = useSimulado();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchAllEstatisticas();
    fetchSimulados();
  }, [isAuthenticated, fetchAllEstatisticas, fetchSimulados, navigate]);

  const handleIniciarSimulado = (id: string) => {
    navigate(`/simulado/${id}`);
  };

  const handleVerEstatisticas = () => {
    navigate('/estatisticas');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name || 'Aluno'}!</h1>
          <p className="text-gray-600">Bem-vindo ao seu dashboard de estudos</p>
        </div>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total de Simulados" 
            value={estatisticasGerais?.totalSimulados || 0} 
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            } 
          />
          <StatCard 
            title="Taxa de Acertos" 
            value={`${estatisticasGerais ? Math.round((estatisticasGerais.acertos / (estatisticasGerais.acertos + estatisticasGerais.erros)) * 100) : 0}%`} 
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            } 
          />
          <StatCard 
            title="Taxa de Erros" 
            value={`${estatisticasGerais ? Math.round((estatisticasGerais.erros / (estatisticasGerais.acertos + estatisticasGerais.erros)) * 100) : 0}%`} 
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            } 
          />
          <StatCard 
            title="Tempo Médio por Questão" 
            value={estatisticasGerais?.tempoMedio || '0m 0s'} 
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            } 
          />
        </div>
        
        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Iniciar Simulado</h3>
            <p className="text-gray-600 mb-4">Teste seus conhecimentos com questões de concursos</p>
            <Button 
              variant="primary" 
              onClick={() => simulados.length > 0 && handleIniciarSimulado(simulados[0].id)}
              disabled={loadingSimulados || simulados.length === 0}
            >
              {loadingSimulados ? 'Carregando...' : 'Começar'}
            </Button>
          </Card>
          
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ver Estatísticas</h3>
            <p className="text-gray-600 mb-4">Acompanhe seu desempenho detalhado</p>
            <Button 
              variant="primary" 
              onClick={handleVerEstatisticas}
              disabled={loadingEstatisticas}
            >
              {loadingEstatisticas ? 'Carregando...' : 'Visualizar'}
            </Button>
          </Card>
          
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-12 h-12 text-primary mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Material de Estudo</h3>
            <p className="text-gray-600 mb-4">Acesse conteúdos personalizados</p>
            <Button variant="primary" onClick={() => navigate('/estudo-personalizado')}>
              Acessar
            </Button>
          </Card>
        </div>
        
        {/* Simulados Recentes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Simulados Recentes</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loadingEstatisticas ? (
              <div className="p-4 text-center text-gray-500">Carregando histórico de simulados...</div>
            ) : historicoSimulados.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {historicoSimulados.slice(0, 3).map((simulado) => (
                  <li key={simulado.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{simulado.tipo}</p>
                            <p className="text-sm text-gray-500">{simulado.data}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {simulado.acertos}/{simulado.total} acertos
                          </span>
                          <Button variant="outline" className="ml-4 text-xs py-1">
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">Nenhum simulado realizado ainda.</div>
            )}
          </div>
          <div className="mt-4 text-right">
            <Button variant="outline" onClick={handleVerEstatisticas}>
              Ver todos os simulados
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

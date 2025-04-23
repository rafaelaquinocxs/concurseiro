import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { useEstatistica } from '../contexts/EstatisticaContext';
import { useNavigate } from 'react-router-dom';

const EstatisticasPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    estatisticasGerais, 
    estatisticasPorMateria, 
    historicoSimulados, 
    loading, 
    error, 
    fetchAllEstatisticas 
  } = useEstatistica();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchAllEstatisticas();
  }, [isAuthenticated, fetchAllEstatisticas, navigate]);

  // Calcular percentuais para o gráfico
  const calcularPercentuais = () => {
    if (!estatisticasGerais) return [];
    
    const total = estatisticasGerais.acertos + estatisticasGerais.erros;
    const percentualAcertos = Math.round((estatisticasGerais.acertos / total) * 100);
    const percentualErros = 100 - percentualAcertos;
    
    return [
      { label: 'Acertos', valor: percentualAcertos, cor: '#10B981' },
      { label: 'Erros', valor: percentualErros, cor: '#EF4444' }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Estatísticas de Desempenho</h1>
          <p className="text-gray-600">Acompanhe seu progresso e identifique áreas para melhorar</p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando estatísticas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Estatísticas Gerais */}
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
                title="Total de Questões" 
                value={estatisticasGerais?.totalQuestoes || 0} 
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
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
                title="Tempo Médio por Questão" 
                value={estatisticasGerais?.tempoMedio || '0m 0s'} 
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                } 
              />
            </div>
            
            {/* Gráfico de Desempenho */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-1">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Desempenho Geral</h2>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                          Acertos
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600">
                          {estatisticasGerais?.acertos || 0}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div style={{ width: `${estatisticasGerais ? (estatisticasGerais.acertos / (estatisticasGerais.acertos + estatisticasGerais.erros)) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                    </div>
                    
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                          Erros
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-red-600">
                          {estatisticasGerais?.erros || 0}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                      <div style={{ width: `${estatisticasGerais ? (estatisticasGerais.erros / (estatisticasGerais.acertos + estatisticasGerais.erros)) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Total de questões:</span>
                      <span className="font-medium">{estatisticasGerais?.totalQuestoes || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Tempo médio por questão:</span>
                      <span className="font-medium">{estatisticasGerais?.tempoMedio || '0m 0s'}</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="lg:col-span-2">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Desempenho por Matéria</h2>
                  
                  {estatisticasPorMateria.length > 0 ? (
                    <div className="space-y-4">
                      {estatisticasPorMateria.map((materia) => (
                        <div key={materia.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{materia.nome}</span>
                            <span className="text-sm font-medium text-gray-700">{Math.round((materia.acertos / materia.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${(materia.acertos / materia.total) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                            <span>{materia.acertos} de {materia.total} acertos</span>
                            <span>Tempo médio: {materia.tempo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma estatística por matéria disponível.</p>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Histórico de Simulados */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Simulados</h2>
                
                {historicoSimulados.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acertos
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentual
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tempo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {historicoSimulados.map((simulado) => (
                          <tr key={simulado.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {simulado.data}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {simulado.tipo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {simulado.acertos} / {simulado.total}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                (simulado.acertos / simulado.total) >= 0.7 
                                  ? 'bg-green-100 text-green-800' 
                                  : (simulado.acertos / simulado.total) >= 0.5 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {Math.round((simulado.acertos / simulado.total) * 100)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {simulado.tempo}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum simulado realizado ainda.</p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default EstatisticasPage;

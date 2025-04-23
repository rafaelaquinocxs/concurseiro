import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useSimulado } from '../contexts/SimuladoContext';
import { useAuth } from '../contexts/AuthContext';

const SimuladoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    simuladoAtual, 
    respostas, 
    resultado, 
    loading, 
    error, 
    iniciarSimulado, 
    responderQuestao, 
    submeterRespostas,
    limparSimuladoAtual
  } = useSimulado();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora em segundos
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Iniciar simulado
  useEffect(() => {
    if (id) {
      iniciarSimulado(id);
      setStartTime(new Date());
    }
    
    return () => {
      // Limpar simulado ao desmontar componente
      limparSimuladoAtual();
    };
  }, [id, iniciarSimulado, limparSimuladoAtual]);
  
  // Configurar temporizador
  useEffect(() => {
    if (simuladoAtual && !isFinished && !resultado) {
      setTimeLeft(simuladoAtual.tempoDuracao);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishSimulado();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [simuladoAtual, isFinished, resultado]);

  // Formatar tempo restante
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Selecionar resposta
  const handleSelectAnswer = (optionIndex: number) => {
    if (!simuladoAtual) return;
    
    const questaoId = simuladoAtual.questoes[currentQuestion].id;
    responderQuestao(questaoId, optionIndex);
  };

  // Navegar para próxima questão
  const handleNextQuestion = () => {
    if (simuladoAtual && currentQuestion < simuladoAtual.questoes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishSimulado();
    }
  };

  // Navegar para questão anterior
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Finalizar simulado
  const handleFinishSimulado = () => {
    if (!simuladoAtual || !startTime) return;
    
    setIsFinished(true);
    const endTime = new Date();
    const tempoGasto = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    submeterRespostas(tempoGasto);
  };

  // Renderizar resultado final
  const renderResult = () => {
    if (!resultado) return null;
    
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Card>
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resultado do Simulado</h2>
            
            <div className="mb-6">
              <div className="text-5xl font-bold text-primary mb-2">{resultado.percentualAcertos}%</div>
              <p className="text-gray-600">Você acertou {resultado.acertos} de {resultado.totalQuestoes} questões</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{resultado.acertos}</div>
                <p className="text-green-800">Acertos</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-1">{resultado.totalQuestoes - resultado.acertos}</div>
                <p className="text-red-800">Erros</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
              <Button variant="outline" onClick={() => {
                setCurrentQuestion(0);
                setIsFinished(false);
              }}>
                Revisar Questões
              </Button>
              <Button variant="primary" onClick={() => {
                navigate('/dashboard');
              }}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Renderizar simulado em andamento
  const renderSimulado = () => {
    if (!simuladoAtual || simuladoAtual.questoes.length === 0) {
      return (
        <div className="max-w-3xl mx-auto py-8 px-4 text-center">
          <Card>
            <div className="p-8">
              {loading ? (
                <p className="text-gray-600">Carregando simulado...</p>
              ) : error ? (
                <div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button variant="primary" onClick={() => navigate('/dashboard')}>
                    Voltar ao Dashboard
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Nenhuma questão disponível para este simulado.</p>
                  <Button variant="primary" onClick={() => navigate('/dashboard')}>
                    Voltar ao Dashboard
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      );
    }
    
    const question = simuladoAtual.questoes[currentQuestion];
    const selectedAnswer = respostas.find(r => r.questaoId === question.id)?.resposta;
    
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Cabeçalho com tempo e progresso */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-500">
            Questão {currentQuestion + 1} de {simuladoAtual.questoes.length}
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-medium text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-1 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${((currentQuestion + 1) / simuladoAtual.questoes.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Questão */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{question.texto}</h2>
            
            <div className="space-y-3 mb-6">
              {question.opcoes.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswer === index 
                      ? 'bg-primary-light bg-opacity-20 border-primary' 
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-2 mt-0.5 ${
                      selectedAnswer === index 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navegação */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                className={currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                disabled={currentQuestion === 0}
              >
                Anterior
              </Button>
              
              {currentQuestion < simuladoAtual.questoes.length - 1 ? (
                <Button variant="primary" onClick={handleNextQuestion}>
                  Próxima
                </Button>
              ) : (
                <Button variant="primary" onClick={handleFinishSimulado}>
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      
      {resultado ? renderResult() : renderSimulado()}
    </div>
  );
};

export default SimuladoPage;

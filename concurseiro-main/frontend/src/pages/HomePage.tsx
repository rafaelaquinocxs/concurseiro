import React from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
                <span className="flex items-center text-primary text-sm font-medium">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Planos a partir de R$49
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Prepare-se para <br />
                seu <span className="text-primary">próximo concurso</span>
              </h1>
              
              <p className="text-gray-700 mb-6">
                Plataforma completa para a sua preparação, com materiais atualizados, simulados realistas e uma metodologia que acelera seu aprendizado. Conte com professores especializados, e uma experiência de ensino interativa para garantir sua aprovação.
              </p>
              
              <Button variant="primary">
                COMEÇAR AGORA MESMO
              </Button>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="/student-image.jpg" 
                alt="Estudante com livros" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x400?text=Estudante+com+livros';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="text-white">
              <div className="text-3xl font-bold">+ 50 mil</div>
              <div className="text-sm">Questões</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">+ 10 mil</div>
              <div className="text-sm">Alunos</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">+ 1000</div>
              <div className="text-sm">Aprovações</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">+ 500</div>
              <div className="text-sm">Concursos</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Study Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-primary-light rounded-lg overflow-hidden">
              <img 
                src="/study-image.jpg" 
                alt="Material de estudo" 
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Material+de+estudo';
                }}
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Estudo personalizado
              </h2>
              <p className="text-gray-700 mb-6">
                Material adaptado ao seu objetivo e nível.
              </p>
              <Button variant="primary">
                COMEÇAR AGORA MESMO
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SimuladoPage from './pages/SimuladoPage';
import EstatisticasPage from './pages/EstatisticasPage';
import PlanosPage from './pages/PlanosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/simulado" element={<SimuladoPage />} />
        <Route path="/estatisticas" element={<EstatisticasPage />} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      </Routes>
    </Router>
  );
};

export default App;

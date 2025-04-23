import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { SimuladoProvider } from './contexts/SimuladoContext';
import { EstatisticaProvider } from './contexts/EstatisticaContext';
import { AssinaturaProvider } from './contexts/AssinaturaContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SimuladoProvider>
        <EstatisticaProvider>
          <AssinaturaProvider>
            <App />
          </AssinaturaProvider>
        </EstatisticaProvider>
      </SimuladoProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();

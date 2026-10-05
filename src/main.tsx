import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const pendingRedirect = sessionStorage.getItem('spa_redirect_path');

if (pendingRedirect) {
  sessionStorage.removeItem('spa_redirect_path');
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (pendingRedirect !== current) {
    window.history.replaceState(null, '', pendingRedirect);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

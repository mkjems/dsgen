import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Tokens + base styles. Imported directly: the package is marked side-effect free,
// so production builds would otherwise drop src/index.ts's own stylesheet import.
import '../../src/styles/index.css';
import './docs.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

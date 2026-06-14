import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './components/AuthContext.tsx';

const rootElement = document.getElementById('root')!;
if (!(window as any).__reactRoot) {
  (window as any).__reactRoot = createRoot(rootElement);
}

(window as any).__reactRoot.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);


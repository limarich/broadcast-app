import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectionProvider } from "./contexts/ConnectionContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <ConnectionProvider>
          <App />
        </ConnectionProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
)

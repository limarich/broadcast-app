import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectionProvider } from "./contexts/ConnectionContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ConnectionProvider>
        <App />
      </ConnectionProvider>
    </AuthProvider>
  </StrictMode>,
)

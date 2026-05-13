import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectionProvider } from "./contexts/ConnectionContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './lib/theme.ts';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <ConnectionProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ConnectionProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
)

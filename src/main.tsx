import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ContextProvider } from './context/Context.tsx'
import DarkModeProvider from './context/DarkModeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ContextProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </ContextProvider>
  </BrowserRouter>
)

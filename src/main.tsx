import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/tailwind.css'
import './css/custom.css'
import App from './App.tsx'
import { PocketProvider } from './contexts/PocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PocketProvider>
      <App />
    </PocketProvider>
  </StrictMode>,
)

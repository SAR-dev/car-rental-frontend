import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/tailwind.css'
import './css/custom.css'
import App from './App.tsx'
import { PocketProvider } from './contexts/PocketContext.tsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PocketProvider>
      <App />
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        gutter={8}
      />
    </PocketProvider>
  </StrictMode>,
)

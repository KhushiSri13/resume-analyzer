import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./style.scss"
import App from './App.jsx'
import { FlashProvider } from './components/FlashProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FlashProvider>
      <App />
    </FlashProvider>
  </StrictMode>,
)

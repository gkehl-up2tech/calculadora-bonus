import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/montserrat'
import './styles/index.css'
import { initTheme } from '@/lib/theme'
import { App } from '@/app/App'

initTheme()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

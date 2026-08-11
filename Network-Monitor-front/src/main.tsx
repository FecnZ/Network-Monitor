import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/providers/AppProviders'
import App from './app/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>,
)
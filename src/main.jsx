import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import CmsProvider from './cms/CmsProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CmsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CmsProvider>
  </StrictMode>,
)

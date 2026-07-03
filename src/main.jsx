import { StrictMode } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@/styles/index.css'
import App from '@/App.jsx'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/context/LanguageContext'

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <LanguageProvider>
          <App />
          <Toaster position="top-right" />
        </LanguageProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ChatContextProvider from './context/chatProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ChatContextProvider>
        <App />
    </ChatContextProvider>
  </BrowserRouter>,
)

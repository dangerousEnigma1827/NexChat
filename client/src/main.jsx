import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'flowbite';
import { UserProvider } from './context/userContext.jsx'
import { ConversationProvider } from './context/conversationContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ConversationProvider>
    <App />
    </ConversationProvider>
  </BrowserRouter>
)

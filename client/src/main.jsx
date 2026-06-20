import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'flowbite';
import { UserProvider } from './context/userContext.jsx'
import { ConversationProvider } from './context/conversationContext.jsx'
import { GroupProvider } from './context/groupContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserProvider>
    <ConversationProvider>
      <GroupProvider>
        <App />
      </GroupProvider>
    </ConversationProvider>
  </UserProvider>
    
  </BrowserRouter>
)

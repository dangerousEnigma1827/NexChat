import { createContext, useState } from "react";

export const ConversationContext = createContext()

export function ConversationProvider({children}){
    let [conversations, setConversations] = useState([]);
    let [conversationSelected, setConversationSelected] = useState(null)
    let [conversationSelectedUsername, setConversationSelectedtedUsername] = useState("")
    let [conversationSelectedAbout, setConversationSelectedtedAbout] = useState("")
    let [conversationSelectedDescription, setConversationSelectedDescription] = useState("")
    let [conversationSelectedPfp, setConversationSelectedtedPfp] = useState(null)
    let [isconversationAGroup, setIsConversationAGroup] = useState(false)
    let [conversationId, setConversationId] = useState()
    
    
    return (
        <ConversationContext.Provider 
        value={{
            conversations,
            setConversations,
            conversationSelected,
            setConversationSelected,
            conversationSelectedUsername,setConversationSelectedtedUsername, conversationSelectedDescription, setConversationSelectedDescription,
            conversationSelectedPfp,
            setConversationSelectedtedPfp,
            isconversationAGroup,
            setIsConversationAGroup,
            conversationId,
            setConversationId,
            conversationSelectedAbout,
            setConversationSelectedtedAbout
        }}>

            {children}
        </ConversationContext.Provider>
    )
}

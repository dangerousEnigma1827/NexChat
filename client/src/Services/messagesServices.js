import api from "../api/apiInstance"

export const getMessagesByConversationId = async (conversationId) => {
    let res = await api.get(`/conversations/allMessagesOfAConversation/${conversationId}`)
    return res.data
}

export const sendMessageService = async (data) => {
    let res = await api.post('/messages/send', data)
    return res;
}

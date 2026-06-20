import api from "../api/apiInstance"

export const getMessagesByConversationId = async (conversationId) => {
    try {
        let res = await api.get(`/conversations/allMessagesOfAConversation/${conversationId}`)

        return res.data
    } catch (err) {
        console.log(err)
    }
}
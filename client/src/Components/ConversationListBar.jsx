import React, { useContext } from 'react'
import { UserRound, UsersRound } from 'lucide-react'
import useTime from '../Hooks/useTime'
import { ConversationContext } from '../context/conversationContext'
import { UserContext } from '../context/userContext'
import { GroupContext } from '../context/groupContext'
import api from '../api/apiInstance'

function ConversationListBar({
  onlineUsers,
  setStartAChat,
  setUserSelectedIdIfNotGroup,
  setAllMessagesBwTwo,
  setIsSideBarOpen,
  conversationSearch,
  loading
}) {

  const { formatTime } = useTime()

  const {
    conversations,
    conversationSelected,
    setConversationId,
    setIsConversationAGroup,
    setConversationSelected,
    setConversationSelectedtedUsername,
    setConversationSelectedDescription,
    setConversationSelectedtedPfp,
    setConversationSelectedtedAbout
  } = useContext(ConversationContext)

  const { currentUserId } = useContext(UserContext)

  const {
    setGroupMembers,
    setGroupAdmins
  } = useContext(GroupContext)

  const setAllMessagesSeen = async (conversationId) => {
    try {
      await api.post('/conversations/setSeen', { conversationId })
    } catch(err) {
      console.log("error occurred setting messages seen", err)
    }
  }

  const filteredConversations = conversations.filter((conversation)=>{

    if(!conversationSearch) return true

    if(conversation.type==="private"){
      let user = conversation.participants.find(
        p=>p._id !== currentUserId
      )

      return user?.username
        ?.toLowerCase()
        .includes(conversationSearch.toLowerCase())
    }

    return conversation.groupName
      ?.toLowerCase()
      .includes(conversationSearch.toLowerCase())
  })

  return (
    <div className="w-full h-full overflow-hidden bg-[#1b1f30] rounded-xl border border-[#1d2230] flex flex-col p-3">

      <button
        className="w-full py-3 bg-[#4c7dff] hover:opacity-90 active:scale-[0.98] transition text-white font-medium rounded-lg shadow-md"
        onClick={()=>setStartAChat(true)}
      >
        + Start New Chat
      </button>

      <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">

        {
          loading.conversation && (
            <div className="flex-1 flex flex-col justify-center items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#2a3142] border-t-[#4c7dff] rounded-full animate-spin"/>
              <p className="text-sm text-gray-400">
                Loading conversations...
              </p>
            </div>
          )
        }

        {
          !loading.conversation &&
          conversations.length===0 && (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400 text-center">
              <p className="font-medium">
                No conversations yet
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Start a new chat to begin
              </p>
            </div>
          )
        }

        {
          !loading.conversation &&
          filteredConversations.map((conversation)=>{

            const user = conversation.participants.find(
              p=>p._id !== currentUserId
            )

            const isActive = conversation._id === conversationSelected

            return (
              <div
                key={conversation._id}
                onClick={()=>{

                  setAllMessagesBwTwo([])

                  if(conversation.type==="private"){

                    setUserSelectedIdIfNotGroup(user._id)
                    setConversationSelected(conversation._id)
                    setConversationId(conversation._id)
                    setIsConversationAGroup(false)
                    setConversationSelectedtedUsername(user.username)
                    setConversationSelectedtedPfp(user.pfp)
                    setConversationSelectedtedAbout(user.about)

                  }else{

                    setUserSelectedIdIfNotGroup(null)
                    setConversationSelected(conversation._id)
                    setConversationId(conversation._id)
                    setIsConversationAGroup(true)
                    setConversationSelectedtedUsername(conversation.groupName)
                    setConversationSelectedDescription(conversation.groupDescription)
                    setConversationSelectedtedPfp(conversation.groupIcon)
                    setGroupMembers(conversation.participants)
                    setGroupAdmins(conversation.groupAdmin)

                  }

                  setIsSideBarOpen(true)
                  setAllMessagesSeen(conversation._id)

                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition hover:bg-[#22283a] ${isActive ? "bg-[#22283a]" : ""}`}
              >

                <div className="relative">

                  <div className="h-12 w-12 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center">

                    {
                      conversation.type==="private"
                      ?
                      user?.pfp
                      ?
                      <img src={user.pfp} className="h-full w-full object-cover"/>
                      :
                      <UserRound className="text-white"/>
                      :
                      conversation.groupIcon
                      ?
                      <img src={conversation.groupIcon} className="h-full w-full object-cover"/>
                      :
                      <UsersRound className="text-white"/>
                    }

                  </div>

                  {
                    conversation.type==="private" &&
                    onlineUsers.includes(user?._id) &&
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#1b1f30]"/>
                  }

                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex justify-between items-center">

                    <p className="text-white font-medium truncate">
                      {
                        conversation.type==="private"
                        ? user?.username
                        : conversation.groupName
                      }
                    </p>

                    <p className="text-[11px] text-gray-500">
                      {
                        conversation.lastTimeMessageSent &&
                        formatTime(conversation.lastTimeMessageSent)
                      }
                    </p>

                  </div>

                  <p className="text-sm text-gray-400 truncate">

                    {
                      conversation.lastMessageSent
                      ?
                      conversation.lastMessageSent.senderId._id === currentUserId
                      ?
                      `You: ${conversation.lastMessageSent.text}`
                      :
                      conversation.type==="private"
                      ?
                      `${user?.username}: ${conversation.lastMessageSent.text}`
                      :
                      `${conversation.lastMessageSent.senderId.username}: ${conversation.lastMessageSent.text}`
                      :
                      "No messages yet"
                    }

                  </p>

                </div>

              </div>
            )
          })
        }

      </div>

    </div>
  )
}

export default ConversationListBar
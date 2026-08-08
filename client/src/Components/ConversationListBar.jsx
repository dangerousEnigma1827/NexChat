// ConversationListBar.jsx
import React, { useContext, useEffect } from 'react'
import { UserRound, UsersRound } from 'lucide-react'
import useTime from '../Hooks/useTime'
import { ConversationContext } from '../context/conversationContext'
import { UserContext } from '../context/userContext'
import { GroupContext } from '../context/groupContext'
import api from '../api/apiInstance'
import socket from '../socket/socket'

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
    conversationId:convo,
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

  useEffect(() => {
    if (!conversationSelected) return;

    socket.emit("join_conversation", conversationSelected);

    return () => {
        socket.emit("leave_conversation", conversationSelected);
    };
  }, [conversationSelected]);


  useEffect(()=>{
    // console.log(onlineUsers)
  },[onlineUsers])


  return (
    <div className="w-full h-full overflow-hidden bg-[#1b1f30] rounded-xl border border-[#1d2230] flex flex-col p-3">

      <button
        className="w-full py-2.5 bg-[#4c7dff] hover:bg-[#3f6ee8] active:scale-[0.98] transition-all duration-150 text-white text-[14px] font-medium rounded-lg shadow-sm"
        onClick={()=>setStartAChat(true)}
      >
        + Start New Chat
      </button>

      <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-1">

        {
          loading.conversation && (
            <div className="flex-1 flex flex-col justify-center items-center gap-3">
              <div className="w-9 h-9 border-[3px] border-[#2a3142] border-t-[#4c7dff] rounded-full animate-spin"/>
              <p className="text-[13px] text-gray-400">
                Loading conversations...
              </p>
            </div>
          )
        }

        {
          !loading.conversation &&
          conversations.length===0 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center gap-1">
              <p className="font-medium text-gray-300 text-[14px]">
                No conversations yet
              </p>
              <p className="text-[12px] text-gray-500">
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

            console.log(conversation)
            return (
              <div
                key={conversation._id}
                onClick={()=>{
                  if((conversation._id != conversationSelected) && (conversation.type==="private")){
                    console.log(user.about)
                    setUserSelectedIdIfNotGroup(user._id)
                    setConversationSelected(conversation._id)
                    setConversationId(conversation._id)
                    setIsConversationAGroup(false)
                    setConversationSelectedtedUsername(user.username)
                    setConversationSelectedtedPfp(user.pfp)
                    setConversationSelectedtedAbout(user.about)
                  }else{
                    if((conversation._id != conversationSelected)){
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
                  }

                  setIsSideBarOpen(true)
                  setAllMessagesSeen(conversation._id)

                }}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[#22283a] ${isActive ? "bg-[#242b3f]" : ""}`}
              >

                <div className="relative flex-shrink-0">

                  <div className="h-12 w-12 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center ring-1 ring-[#2a3142]">

                    {
                      conversation.type==="private"
                      ?
                      user?.pfp
                      ?
                      <img src={user.pfp} className="h-full w-full object-cover"/>
                      :
                      <UserRound size={20} className="text-gray-400"/>
                      :
                      conversation.groupIcon
                      ?
                      <img src={conversation.groupIcon} className="h-full w-full object-cover"/>
                      :
                      <UsersRound size={20} className="text-gray-400"/>
                    }

                  </div>

                  {
                    conversation.type==="private" &&
                    onlineUsers.includes(user?._id) &&
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 rounded-full border-2 border-[#1b1f30]"/>
                  }

                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex justify-between items-center gap-2">

                    <p className="text-[14px] text-gray-100 font-medium truncate">
                      {
                        conversation.type==="private"
                        ? user?.username
                        : conversation.groupName
                      }
                    </p>

                    <p className="text-[11px] text-gray-500 flex-shrink-0">
                      {
                        conversation.lastTimeMessageSent &&
                        formatTime(conversation.lastTimeMessageSent)
                      }
                    </p>

                  </div>

                  <p className="text-[12.5px] text-gray-500 truncate mt-0.5">
                    {
                        conversation.lastMessageSent
                        ?
                        conversation.lastMessageSentBy?._id === currentUserId
                        ?
                        `You: ${conversation.lastMessageSent.text}`
                        :
                        conversation.type === "private"
                        ?
                        `${user?.username}: ${conversation.lastMessageSent.text}`
                        :
                        `${conversation.lastMessageSentBy?.username}: ${conversation.lastMessageSent.text}`
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
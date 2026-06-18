import React from 'react'
import { UserRound, UsersRound } from 'lucide-react'
import useTime from '../Hooks/useTime'

function ConversationListBar({
  conversationSelected,
  setConversationSelected,
  setConversationSelectedtedUsername,
  setConversationSelectedtedPfp,
  onlineUsers,
  setStartAChat,
  conversations,
  currentUserId,
  setConversationId,
  setIsConversationAGroup,
  setGroupMembers,
  setGroupAdmins,
  setUserSelectedIdIfNotGroup,
  setAllMessagesBwTwo,
  setIsSideBarOpen,
  setConversationSelectedDescription
}) {

  let { formatTime } = useTime()

  return (
    <div className="w-full h-full overflow-hidden bg-[#1b1f30] rounded-xl border border-[#1d2230] flex flex-col p-3">

      {/* Start chat */}
      <div className="w-full">
        <button
          className="w-full py-3 bg-[#4c7dff] hover:opacity-90 active:scale-[0.98] transition text-white font-medium rounded-lg shadow-md"
          onClick={() => setStartAChat(true)}
        >
          + Start New Chat
        </button>
      </div>

      {/* Conversations list */}
      <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">

        {conversations.map((conversation, index) => {

          let user = conversation.participants.find(
            (p) => p._id != currentUserId
          )

          const isActive = conversation._id == conversationSelected

          return (
            <div
              key={index}
              onClick={() => {

                setAllMessagesBwTwo([])

                if (conversation.type === "private") {
                  setUserSelectedIdIfNotGroup(user._id)
                  setConversationSelected(conversation._id)
                  setConversationId(conversation._id)

                  setIsConversationAGroup(false)
                  setConversationSelectedtedUsername(user.username)
                  setConversationSelectedtedPfp(user.pfp)
                  setIsSideBarOpen(true)

                } else {
                  setUserSelectedIdIfNotGroup(null)
                  setConversationSelected(conversation._id)
                  setConversationId(conversation._id)

                  setIsConversationAGroup(true)
                  setConversationSelectedtedUsername(conversation.groupName)
                  setConversationSelectedDescription(conversation.groupDescription)
                  setConversationSelectedtedPfp(conversation.groupIcon)
                  setGroupMembers(conversation.participants)
                  setGroupAdmins(conversation.groupAdmin)
                  setIsSideBarOpen(true)
                }
              }}
              className={`
                group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                transition-all duration-200
                hover:bg-[#1a1f2e]
                ${isActive ? "bg-[#22283a]" : ""}
              `}
            >

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center ring-1 ring-[#2a3142] group-hover:ring-[#4c7dff]/40 transition">

                  {conversation.type === "private" ? (
                    user?.pfp ? (
                      <img
                        src={user.pfp}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="text-white" />
                    )
                  ) : (
                    conversation.groupIcon ? (
                      <img
                        src={conversation.groupIcon}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UsersRound className="text-white" />
                    )
                  )}

                </div>

                {/* Online dot only for private */}
                {conversation.type === "private" &&
                  onlineUsers.includes(user?._id) && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#0f111a]" />
                  )}
              </div>


              <div className="flex flex-col min-w-0 flex-1">

                {/* PRIVATE CHAT */}
                {conversation.type === "private" ? (
                  <>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-white font-medium truncate">
                        {user?.username}
                      </p>

                      <p className="text-[11px] text-gray-500 whitespace-nowrap">
                        {conversation.lastTimeMessageSent
                          ? formatTime(conversation.lastTimeMessageSent)
                          : ""}
                      </p>
                    </div>

                    <p className="text-sm text-gray-400 truncate leading-snug">
                      {conversation.lastMessageSent
                        ? `${conversation.lastMessageSentBy === currentUserId ? "You" : user?.username}: ${conversation.lastMessageSent}`
                        : "No messages yet"}
                    </p>
                  </>
                ) : (

                  /* GROUP CHAT */
                  <>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-white font-medium truncate">
                        {conversation.groupName}
                      </p>

                      <p className="text-[11px] text-gray-500 whitespace-nowrap">
                        {conversation.lastTimeMessageSent
                          ? formatTime(conversation.lastTimeMessageSent)
                          : ""}
                      </p>
                    </div>

                    <p className="text-sm text-gray-400 truncate leading-snug">
                      {conversation.lastMessageSent
                        ? `${conversation.lastMessageSentBy === currentUserId ? "You" :conversation.lastMessageSentBy.username }: ${conversation.lastMessageSent}`
                        : "No messages yet"}
                    </p>
                  </>
                )}

              </div>

            </div>
          )
        })}

      </div>
    </div>
  )
}

export default ConversationListBar
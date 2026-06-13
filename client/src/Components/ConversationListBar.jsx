import React, { useState } from 'react'
import { Search } from 'lucide-react'
import useTime from '../Hooks/useTime'

function ConversationListBar({users, conversationSelected, setConversationSelected, setConversationSelectedtedUsername, setConversationSelectedtedPfp, onlineUsers, setStartAChat, conversations, currentUserId, setConversationId, setIsConversationAGroup, setGroupMembers, setGroupAdmins}){

    let {formatTime} = useTime()
  return (
    <>
    <div className='w-[100%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2 mb-2'>
        <Search className='text-white ml-4' size={19}/>
        <input type="text" placeholder='Seach Chats' className='outline-none bg-transparent text-white  h-[8vh] text-md placeholder:text-gray-500'/>
    </div>
    <div className='w-[100%] bg-[#141720] rounded-md flex items-center justify-center'>
        <button className='h-[8vh] w-full bg-[#4c7dff] transition-all duration-300 active:scale-98 hover:bg-[#3f6ee8] text-white flex justify-center items-center rounded-lg text-md cursor-pointer border-none' onClick={(e)=>{
            setStartAChat(true)
        }}>Start New Chat</button>
    </div>

    <div className='w-[100%] mt-6 flex flex-col items-center overflow-y-auto '>
        {
            conversations.map((conversation, index)=>{
                // let user=conversation.participants[0] !== currentUserId ? conversation.participants[1] : conversation.participants[0]
                console.log(conversation)
                let user = conversation.participants.find((participant)=>{
                    return participant._id != currentUserId
                })
                return <div key={index} className={`h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all ${(user._id == conversationSelected) || (conversation._id == conversationSelected) ? "bg-[#2b3142]" : ""}`} onClick={(e)=>{
                    if(conversation.type=="private"){
                        setIsConversationAGroup(false)
                        setConversationId(conversation._id)
                        setConversationSelected(user._id)
                        setConversationSelectedtedUsername(user.username)
                        setConversationSelectedtedPfp(user.pfp)
                    }else{
                        setIsConversationAGroup(true)
                        setConversationId(conversation._id)
                        setConversationSelected(conversation._id)
                        setConversationSelectedtedUsername(conversation.groupName)
                        setConversationSelectedtedPfp(conversation.groupIcon)
                        setGroupMembers(conversation.participants)
                        setGroupAdmins(conversation.admins)
                    }
                }}>


                {conversation.type == "private" && (
                <div className='flex items-center gap-4 w-full'>
                    <div className='relative'>
                        <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center text-center'>
                            {user.pfp ? (
                                <img
                                    src={user.pfp}
                                    className='h-full w-full object-cover rounded-full'
                                />
                            ) : (
                                <p className='text-white text-md font-medium'>
                                    {user.username?.substring(0, 1).toUpperCase()}
                                </p>
                            )}
                        </div>

                        {onlineUsers.includes(user._id) && (
                            <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#212634]' />
                        )}
                    </div>
                    <div className='flex flex-col min-w-0 flex-1'>

                        <div className='flex justify-between items-center w-full'>
                            <p className='text-white text-lg font-medium truncate'>
                                {user.username}
                            </p>

                            <p className='text-xs text-gray-400 whitespace-nowrap ml-2'>
                                {formatTime(conversation.lastTimeMessageSent)}
                            </p>
                        </div>

                        <p className='text-sm text-gray-400 truncate'>
                            {conversation.lastMessageSent
                                ? `${conversation.lastMessageSentBy == currentUserId ? "You" : user.username}: ${conversation.lastMessageSent}`
                                : ""}
                        </p>

                    </div>
                </div>
                )}
                    {conversation.type=="group" && 
                        <div className='flex items-center gap-4 '>

                        <div className='relative'>
                            <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center text-center '>
                                
                                {conversation.groupIcon && <img src={conversation.groupIcon} className='h-full w-full object-cover rounded-full' />}
                                {
                                    !conversation.groupIcon && (
                                        <p className='text-white text-md font-medium'>
                                            {conversation.groupName?.substring(0,1).toUpperCase()}
                                        </p>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex flex-col min-w-0'>
                            <div className='flex justify-between items-center'>
                                <p className='text-xl text-white'>{conversation.groupName}</p>
                            </div>
                        </div>

                        </div>
                    }
                    
                    
                </div>
            })
        }
    </div>
    </>
  )
}

export default ConversationListBar
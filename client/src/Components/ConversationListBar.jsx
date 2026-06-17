import React, { useState } from 'react'
import { Search, UserRound } from 'lucide-react'
import useTime from '../Hooks/useTime'

function ConversationListBar({users, conversationSelected, setConversationSelected, setConversationSelectedtedUsername, setConversationSelectedtedPfp, onlineUsers, setStartAChat, conversations, currentUserId, setConversationId, setIsConversationAGroup, setGroupMembers, setGroupAdmins, setUserSelectedIdIfNotGroup}){


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
                let user = conversation.participants.find((participant)=>{
                    return participant._id != currentUserId
                })
                return <div key={index} className={`h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all ${(conversation._id == conversationSelected) ? "bg-[#2b3142]" : ""}`} onClick={(e)=>{
                    if(conversation.type=="private"){
                        setUserSelectedIdIfNotGroup(user._id)
                        setConversationSelected(conversation._id)
                        setConversationId(conversation._id)

                        setIsConversationAGroup(false)
                        setConversationSelectedtedUsername(user.username)
                        setConversationSelectedtedPfp(user.pfp)
                    }else{
                        setUserSelectedIdIfNotGroup(null)
                        setConversationSelected(conversation._id)
                        setConversationId(conversation._id)

                        setIsConversationAGroup(true)
                        setConversationSelectedtedUsername(conversation.groupName)
                        setConversationSelectedtedPfp(conversation.groupIcon)
                        setGroupMembers(conversation.participants)
                        console.log(conversation.participants)
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
                                    <div className='h-full w-full flex justify-center items-center object-cover'>
                                        <UserRound/>
                                    </div>
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
                        <div className='rounded-full bg-[#141720] h-[8vh] w-[8vh] flex justify-center items-center text-center '>
                            
                            {
                                conversation.groupIcon && 
                                    <img src={conversation.groupIcon} className='h-full w-full object-cover rounded-full'/>
                            }

                            {
                                !conversation.groupIcon && 
                                    <div className='h-full w-full flex justify-center items-center object-cover border-1 text-white border-[#2b3142]'>
                                        <UserRound/>
                                    </div>
                            }
                        </div>
                    </div>

                    <div className='flex flex-col min-w-0'>
                        <div className='flex justify-between items-center'>
                            <p className='text-xl text-white'>{conversation.groupName}</p>
                        </div>
                        <div className='flex justify-between items-center text-gray-400 truncate text-sm'>
                            {
                                conversation.participants.map((p)=>{
                                    return p.username
                                }).join(", ")
                            }
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
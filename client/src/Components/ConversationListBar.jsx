import React, { useState } from 'react'
import { Search } from 'lucide-react'

function ConversationListBar({users, userSeleted, setUserSeletec, setUserSeletectedUsername, setUserSeletectedPfp, onlineUsers, setStartAChat, conversations, currentUserId, setConversationId}){
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
                let user=conversation.participants[0] !== currentUserId ? conversation.participants[1] : conversation.participants[0]
                return <div key={user._id} className={`h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all ${user._id == userSeleted ? "bg-[#2b3142]" : ""}`} onClick={(e)=>{
                    setConversationId(conversation._id)
                    setUserSeletec(user._id)
                    setUserSeletectedUsername(user.username)
                    setUserSeletectedPfp(user.pfp)
                }}>
                    {conversation.type=="private" && 
                        <div className='flex items-center gap-4 '>

                        <div className='relative'>
                            <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center text-center '>
                                
                                {user.pfp && <img src={user.pfp} className='h-full w-full object-cover rounded-full' />}
                                {
                                    !user.pfp && (
                                        <p className='text-white text-md font-medium'>
                                            {user.username?.substring(0,1).toUpperCase()}
                                        </p>
                                    )
                                }
                            </div>
                            {
                                onlineUsers.includes(user._id) && (
                                    <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#212634]'></div>
                                )
                            }
                        </div>

                        <div className='flex flex-col min-w-0'>
                            <div className='flex justify-between items-center'>
                                <p className='text-xl text-white'>{user.username}</p>
                            </div>
                        </div>

                        </div>
                    }
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
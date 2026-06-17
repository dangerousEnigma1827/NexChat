import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'

function SelectedConversation({conversationSelectedPfp, conversationSelectedUsername, dropdownOpen, setDropdownOpen, onlineUsers, conversationSelected, setClearChatPopupOpen, isconversationAGroup, groupMembers, setIsSideBarOpen, setConversationSelected}) {

    let [currentUserName, setCurrentUserName] = useState(null)
    let token = localStorage.getItem('token')
    let getCurrentUser = async () => {
        try{
            let getcurrentuserinfo = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCurrentUserName(getcurrentuserinfo.data._id)
        }catch(err){
            console.log("error occured getting current user", err);
        }
    }

    useEffect(()=>{
        getCurrentUser()
    }, [conversationSelected])

  return (
    <div className='w-full h-[10vh] bg-[#1d202f] flex items-center gap-4'>
        <div className='flex gap-2 items-center'>
            <ArrowLeft className='hover:bg-[#2b3142] rounded-full p-2 cursor-pointer transition ml-3 text-xl text-white md:hidden' size={38} onClick={()=>{
                setConversationSelected(null)
                }}/>
            <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center md:ml-6' onClick={(e)=>{setIsSideBarOpen(true)}}>
                {
                    conversationSelectedPfp && (
                        <img src={conversationSelectedPfp} className='h-full w-full object-cover rounded-full' />
                    )
                }
                {
                    !conversationSelectedPfp && (
                        <p className='text-white text-md font-medium'>
                            {conversationSelectedUsername?.substring(0,1).toUpperCase()}
                        </p>
                    )
                }
            </div>
            <div className='flex flex-col' onClick={(e)=>{setIsSideBarOpen(true)}}>
                <p className='text-xl text-white'>{conversationSelectedUsername}</p>
                {
                    !isconversationAGroup && 
                    <p className='text-sm text-gray-400'>{onlineUsers.includes(conversationSelected) ? "Online" : "Offline"}</p>
                }
                {
                    isconversationAGroup && 
                    <div className='flex justify-center items-center text-sm text-gray-400 gap-2'>
                        {
                            groupMembers.map((member, index)=>{
                                return <div key={index}>
                                        <p>{member._id == currentUserName ? "You": member.username}{groupMembers.length != index+1 ? " ," : ""} </p>
                                    </div>
                            })
                        }
                    </div>
                }
            </div>
        </div>

        {/* three dot wala */}
        <div className='relative ml-auto mr-6'>

            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-white hover:bg-[#2b3142] rounded-md p-2 transition-all" type="button">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M12 6h.01M12 12h.01M12 18h.01"/></svg>
            </button>

            {
                dropdownOpen &&
                <div className="absolute right-0 mt-2 bg-[#232a3a] border border-[#31384d] rounded-md shadow-lg w-44 z-50">
                    <ul className="p-2 text-sm text-gray-300">
                        <li><button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded-md transition-all">View Profile</button></li>
                        <li><button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded-md transition-all" onClick={(e)=>{
                            setClearChatPopupOpen(true)
                        }}>Clear Chat</button></li>
                    </ul>
                </div>
            }
        </div>

    </div>
  )
}

export default SelectedConversation
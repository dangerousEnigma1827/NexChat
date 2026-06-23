import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, UserRound, UsersRound } from 'lucide-react'
import { useContext } from 'react';
import { ConversationContext } from '../context/conversationContext.jsx';
import { GroupContext } from '../context/groupContext.jsx';

function SelectedConversation({
  dropdownOpen,
  setDropdownOpen,
  onlineUsers,
  setClearChatPopupOpen,
  setIsSideBarOpen,
}) {

  let {conversationSelectedPfp,
    conversationSelectedUsername,
    conversationSelected,
    isconversationAGroup,
    setConversationSelected} = useContext(ConversationContext)

  let {groupMembers} = useContext(GroupContext)

  let [currentUserName, setCurrentUserName] = useState(null)
  let token = localStorage.getItem('token')



  let getCurrentUser = async () => {
    try {
      let res = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCurrentUserName(res.data._id)
    } catch (err) {
      console.log("error occured getting current user", err);
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [conversationSelected])

  return (
    <div className='w-full h-[10vh] bg-[#1d202f] flex items-center justify-between px-3'>

      {/* LEFT SECTION */}
      <div className='flex items-center gap-3 flex-1'>

        <ArrowLeft
          size={34}
          className='text-white p-2 rounded-full hover:bg-[#2b3142] cursor-pointer md:hidden'
          onClick={() => setConversationSelected(null)}
        />

        <div
          className='flex items-center gap-3 flex-1 cursor-pointer'
          onClick={() => setIsSideBarOpen(true)}
        >

          {/* Avatar */}
          <div className='h-11 w-11 rounded-full bg-[#141720] flex items-center justify-center overflow-hidden'>
            {conversationSelectedPfp ? (
              <img src={conversationSelectedPfp} className='h-full w-full object-cover' />
            ) : !isconversationAGroup ? (
              <UserRound className='text-white' />
            ) : (
              <UsersRound className='text-white' />
            )}
          </div>

          {/* Text */}
          <div className='flex flex-col leading-tight'>
            <p className='text-white text-base font-medium'>
              {conversationSelectedUsername}
            </p>

            {!isconversationAGroup ? (
              <p className='text-xs text-gray-400'>
                {onlineUsers.includes(conversationSelected) ? "Online" : "Offline"}
              </p>
            ) : (
              <p className='text-xs text-gray-400'>
                {groupMembers
                  .map(m => m._id === currentUserName ? "You" : m.username)
                  .join(", ")}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT SECTION */}
      {/* <div className='relative'>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className='text-white p-2 rounded-md hover:bg-[#2b3142]'
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M12 6h.01M12 12h.01M12 18h.01"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div className='absolute right-0 mt-2 w-40 bg-[#232a3a] border border-[#31384d] rounded-md shadow-lg'>
            <button className='w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#2b3142] hover:text-white'>
              View Profile
            </button>
            <button
              className='w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#2b3142] hover:text-white'
              onClick={() => setClearChatPopupOpen(true)}
            >
              Clear Chat
            </button>
          </div>
        )}
      </div> */}

    </div>
  )
}

export default SelectedConversation
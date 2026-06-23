import React, { useContext } from 'react'
import { XIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { UserIcon, EnvelopeIcon } from "@phosphor-icons/react"
import { UserContext } from '../../context/userContext'

function UserProfilePopup({ user, setUserProfilePopupOpen, setEditProfilePopupOpen }) {

  let {
    currentUserId, setUserId, currentUserUsername, setCurrentUserUsername, currentUserAbout, setCurrentUserAbout, currentUserPfp, setCurrentUserPfp,currentUserEmail, setCurrentUserEmail
  } = useContext(UserContext)

  console.log(currentUserId, currentUserUsername)

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100000]'>

      <div className='w-[500px] bg-[#1b2130] rounded-3xl shadow-2xl p-8 border border-[#2e3548]'>

        {/* Close */}
        <div className='flex justify-end'>
          <button
            onClick={() => setUserProfilePopupOpen(false)}
            className='text-gray-400 hover:text-white transition'
          >
            <XIcon size={22}/>
          </button>
        </div>


        {/* Profile image */}
        <div className='flex flex-col items-center mt-2'>

          {currentUserPfp ? (
            <img
              src={currentUserPfp}
              className='w-[130px] h-[130px] rounded-full object-cover border-4 border-[#3b82f6]'
            />
          ) : (
            <div className='w-[130px] h-[130px] rounded-full bg-[#11151f] flex justify-center items-center'>
              <UserIcon size={45} color="#3b82f6"/>
            </div>
          )}

          <h1 className='text-2xl text-white font-semibold mt-4'>
            {currentUserUsername || " "}
          </h1>

          <p className='text-gray-400 text-sm'>
            {/* @{currentUserUsername?.toLowerCase() || " "} */}
          </p>
        </div>


        {/* Info */}
        <div className='mt-8 space-y-6'>

          <div>
            <p className='text-xs uppercase tracking-wider text-gray-500 mb-2'>
              About
            </p>

            <p className='text-gray-200 leading-relaxed'>
              {currentUserAbout || "No bio added"}
            </p>
          </div>


          <div className='border-b border-[#2e3548]'>
            <p className='text-xs uppercase tracking-wider text-gray-500 mb-2'>
              Email
            </p>

            <p className='text-gray-300 mb-4'>
              {currentUserEmail|| " "}
            </p>
          </div>

        </div>


        {/* Button */}
        <button
          onClick={() => {
            setUserProfilePopupOpen(false)
            setEditProfilePopupOpen(true)
          }}
          className='w-full mt-4 h-[52px] rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white flex justify-center items-center gap-2 transition'
        >
          <PencilSimpleIcon size={18}/>
          Edit Profile
        </button>

      </div>
    </div>
  )
}

export default UserProfilePopup
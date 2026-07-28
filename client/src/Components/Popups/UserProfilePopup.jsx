// UserProfilePopup.jsx
import React, { useContext, useState } from 'react'
import { XIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { UserIcon, EnvelopeSimpleIcon, InfoIcon } from "@phosphor-icons/react"
import { UserContext } from '../../context/userContext'

function UserProfilePopup({
  setUserProfilePopupOpen,
  setEditProfilePopupOpen,
  setActive
}) {

  const {
    currentUserUsername,
    currentUserAbout,
    currentUserPfp,
    currentUserEmail
  } = useContext(UserContext)

  // purely presentational — shows a skeleton while the avatar image loads
  const [imgLoaded, setImgLoaded] = useState(false)


  const closePopup = () => {
    setUserProfilePopupOpen(false)
    setActive("chats")
  }


  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100000] px-4'>

      <div className='w-full max-w-[400px] bg-[#1b2130] rounded-xl shadow-2xl p-6 border border-[#2a3040]'>


        {/* Header */}
        <div className='flex justify-between items-center mb-5'>
          <p className='text-[15px] font-semibold text-white'>Profile</p>
          <button
            onClick={()=>{
              closePopup()
            }}
            className='w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#242b3f] hover:text-white transition-colors duration-150'
          >
            <XIcon size={17}/>
          </button>
        </div>



        {/* Profile Image */}

        <div className='flex flex-col items-center'>

          <div className='relative w-[96px] h-[96px]'>

            {
              currentUserPfp ?
              <>
                {!imgLoaded && (
                  <div className='absolute inset-0 rounded-full bg-[#242b3f] animate-pulse ring-2 ring-[#2a3142]' />
                )}
                <img
                  src={currentUserPfp}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-[96px] h-[96px] rounded-full object-cover ring-2 ring-[#4c7dff]/40 transition-opacity duration-200 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </>
              :
              <div className='w-[96px] h-[96px] rounded-full bg-[#141720] flex justify-center items-center ring-2 ring-[#2a3142]'>
                <UserIcon size={36} className='text-gray-500'/>
              </div>
            }

          </div>


          <h1 className='text-[17px] text-white font-semibold mt-3 tracking-tight'>
            {currentUserUsername || " "}
          </h1>

        </div>




        {/* Details */}

        <div className='mt-6 space-y-3'>

          <div className='bg-[#141720] rounded-lg border border-[#2a3040] p-3'>
            <div className='flex items-center gap-1.5 mb-1.5'>
              <InfoIcon size={12} className='text-gray-500' />
              <p className='text-[11px] uppercase tracking-wider text-gray-500 font-semibold'>
                About
              </p>
            </div>
            <p className='text-[13px] text-gray-300 leading-relaxed'>
              {currentUserAbout || "No bio added"}
            </p>
          </div>



          <div className='bg-[#141720] rounded-lg border border-[#2a3040] p-3'>
            <div className='flex items-center gap-1.5 mb-1.5'>
              <EnvelopeSimpleIcon size={12} className='text-gray-500' />
              <p className='text-[11px] uppercase tracking-wider text-gray-500 font-semibold'>
                Email
              </p>
            </div>
            <p className='text-[13px] text-gray-300 truncate'>
              {currentUserEmail || " "}
            </p>
          </div>


        </div>





        {/* Edit Button */}

        <button
          onClick={() => {
            setUserProfilePopupOpen(false)
            setEditProfilePopupOpen(true)
            setActive("chats")
          }}
          className='w-full mt-5 h-[44px] rounded-lg bg-[#4c7dff] hover:bg-[#3f6ee8] text-[13.5px] font-medium text-white flex justify-center items-center gap-2 transition-colors duration-150 shadow-sm'
        >

          <PencilSimpleIcon size={15}/>

          Edit Profile

        </button>


      </div>

    </div>
  )
}

export default UserProfilePopup
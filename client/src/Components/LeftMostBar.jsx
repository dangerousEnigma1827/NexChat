import React from 'react'
import {ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon} from "@phosphor-icons/react"


function LeftMostBar({setLogoutPopupOpen}) {
  return (
    <>
    <div className='w-[4vw] min-h-[100vh] bg-[#141720] flex flex-col items-center justify-between '>
        <div className='mt-6 mb-6 h-screen flex flex-col justify-between'>
            <ChatCircleTextIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' />
            <SignOutIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' onClick={(e)=>{
                setLogoutPopupOpen(true)
            }} />
        </div>
    </div>
    </>
  )
}

export default LeftMostBar
import React from 'react'
import {ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon, UsersIcon} from "@phosphor-icons/react"
import { UsersRound } from 'lucide-react'


function LeftMostBar({setLogoutPopupOpen ,setCreateGroupPopupOpen}) {
  return (
    <>
    <div className='w-[4vw] min-h-[100vh] bg-[#141720] flex flex-col items-center justify-between '>
        <div className='mt-6 mb-6 h-screen flex flex-col justify-between'>
            <div className='flex flex-col gap-5'>
              <ChatCircleTextIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' />
              <UsersIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' onClick={(e)=>{setCreateGroupPopupOpen(e)}}/>
            </div>
            <SignOutIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' onClick={(e)=>{
                setLogoutPopupOpen(true)
            }} />
        </div>
    </div>
    </>
  )
}

export default LeftMostBar
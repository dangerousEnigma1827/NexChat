import React from 'react'
import {ChatsCircleIcon} from "@phosphor-icons/react"

function NexChatIcon() {
  return (
    <>
    <div className='flex gap-2 items-center w-[100%] mb-5'>
        <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='' />
        <p className='text-white title text-3xl font-normal '>NexChat</p>
    </div>
    </>
  )
}

export default NexChatIcon
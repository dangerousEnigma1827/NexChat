import React from 'react'
import { Search } from "lucide-react";
import {ChatsCircleIcon, ChatCircleTextIcon} from "@phosphor-icons/react"

function HomePage() {
  return (
    //top most parent
    <div className='flex w-full h-screen'>

        <div className='w-[4vw] min-h-[100vh] bg-[#141720] flex flex-col items-center '>
            <div className='mt-6'>
                <ChatCircleTextIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' />
            </div>
        </div>

        <div className='w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center'>
            {/* //inner content */}
            <div className='w-[80%] mt-5'>
                <div className='flex gap-2 items-center w-[100%] mb-3'>
                    <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='' />
                    <p className='text-white title text-3xl font-normal '>NexChat</p>
                </div>

                {/* search bar */}
                <div className='w-[100%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <Search className='text-white ml-4' size={19}/>
                    <input type="text" placeholder='Seach Chats' className='outline-none bg-transparent text-white  h-[8vh] text-md placeholder:text-gray-500'/>
                </div>
            </div>

            
        </div>

        <div className='w-[71vw] bg-[#141720] min-h-[100vh]'>

        </div>

    </div>
  )
}

export default HomePage
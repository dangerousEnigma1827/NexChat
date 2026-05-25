import React from 'react'
import { Plus } from 'lucide-react'
import { Send } from 'lucide-react'

function InputArea({handleMedia, sendMessageFunc, text, setText}) {
  return (
    <>
    <div className='w-full h-[10vh] bg-[#1d202f] flex items-center justify-center'>
        <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
            <label>
                <Plus className='text-white cursor-pointer ml-6' />
                <input type="file" className='hidden' multiple onChange={(e)=>{
                    handleMedia(e)
                }}/>
            </label>
            <input type="text" placeholder='Write A Message!' className='outline-none  text-white w-[95%]  h-[8vh] text-md placeholder:text-gray-500 px-4 bg-transparent' value={text} onChange={(e)=>{setText(e.target.value)}} onKeyDown={(e)=>{
                if(e.key == "Enter"){
                    sendMessageFunc()
                    setText("")
                }
            }}/>
            <Send className={`text-white mr-6 ${text?.trim() != "" ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={(e)=>{
                sendMessageFunc()
                setText("")
            }}/>
        </div>
    </div>
    </>
  )
}

export default InputArea
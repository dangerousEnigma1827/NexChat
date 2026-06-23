import React from 'react'
import { Plus, Send } from 'lucide-react'

function InputArea({ handleMedia, sendMessageFunc, text, setText , imageBlobs, setImageBlobs}) {
  return (
    <div className='w-full px-4 py-3 bg-[#11131a] border-t border-[#2a2f3d] flex justify-center'>
      
      <div className='w-full max-w-5xl bg-[#1a1d27] rounded-2xl px-4 py-3 flex gap-3 shadow-lg items-center'>

        {/* File Upload */}
        <label className=''>
          <div className='p-2 rounded-full hover:bg-[#2b3142] transition cursor-pointer'>
            <Plus size={22} className='text-gray-300' />
          </div>

          <input
            type="file"
            className='hidden'
            multiple
            onChange={(e) =>{
              handleMedia(e)
              e.target.value=null
            }}
          />
        </label>

        {/* Textarea */}
        <textarea
          placeholder='Type a message...'
          className='flex-1 bg-transparent resize-none outline-none border-none text-white placeholder:text-gray-500 text-sm max-h-32 min-h-[24px] py-2 leading-6'
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (text.trim()) {
                sendMessageFunc()
                setText("")
              }
            }
          }}
        />

        <button
          disabled={!text?.trim() && imageBlobs.length == 0}
          onClick={() => {
            if (!text.trim() && imageBlobs.length==0) return
            sendMessageFunc()
            setText("")
            setImageBlobs([])
          }}
          className={` p-2 rounded-full transition ${
            (text?.trim() || imageBlobs.length > 0)
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-[#2b3142] cursor-not-allowed"
          }`}
        >
          <Send size={18} className='text-white' />
        </button>

      </div>
    </div>
  )
}

export default InputArea
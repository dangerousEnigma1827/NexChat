// InputArea.jsx
import React from 'react'
import { Plus, Send } from 'lucide-react'
import * as Tooltip from "@radix-ui/react-tooltip"

function InputArea({ 
  handleMedia, 
  sendMessageFunc, 
  text, 
  setText, 
  imageBlobs, 
  setImageBlobs
}) {

  const tooltipClass = `
    bg-[#1a1f2e]
    text-white
    text-[11.5px]
    font-medium
    px-2.5
    py-1
    rounded-md
    shadow-lg
    border border-[#2a3142]
  `

  const canSend = (text?.trim()?.length > 0) || imageBlobs.length > 0

  return (

    <Tooltip.Provider delayDuration={300}>

      <div className='w-full px-4 py-3 bg-[#141720] border-t border-[#2a3040] flex justify-center'>
        
        <div className='w-full max-w-5xl bg-[#1b2130] rounded-xl border border-[#2a3040] focus-within:border-[#4c7dff]/40 px-3.5 py-2.5 flex gap-2.5 items-center transition-colors duration-150'>


          {/* Upload */}

          <Tooltip.Root>

            <Tooltip.Trigger asChild>

              <label className='cursor-pointer flex-shrink-0'>

                <div className='p-2 rounded-full hover:bg-[#242b3f] transition-colors duration-150'>
                  <Plus size={20} className='text-gray-400' />
                </div>


                <input
                  type="file"
                  className='hidden'
                  multiple
                  onChange={(e)=>{
                    handleMedia(e)
                    e.target.value=null
                  }}
                />

              </label>

            </Tooltip.Trigger>


            <Tooltip.Content
              side="top"
              sideOffset={8}
              className={tooltipClass}
            >
              Attach files
              <Tooltip.Arrow className="fill-[#1a1f2e]" />
            </Tooltip.Content>


          </Tooltip.Root>






          {/* Text Input */}

          <textarea
            placeholder='Type a message...'
            className='flex-1 bg-transparent resize-none outline-none border-none text-white placeholder:text-gray-500 text-[14px] max-h-32 min-h-[22px] py-1.5 leading-6'
            rows={1}
            value={text}
            onChange={(e)=>setText(e.target.value)}

            onKeyDown={(e)=>{

              if(e.key==="Enter" && !e.shiftKey){

                e.preventDefault()

                if(text.trim()){
                  sendMessageFunc()
                  setText("")
                }

              }

            }}

          />







          {/* Send */}

          <Tooltip.Root>

            <Tooltip.Trigger asChild>

              <button

                disabled={!canSend}

                onClick={()=>{

                  if(!canSend)
                    return

                  sendMessageFunc()

                  setText("")
                  setImageBlobs([])

                }}

                className={`
                  p-2 rounded-full transition-colors duration-150 flex-shrink-0
                  ${
                    canSend
                    ?
                    "bg-[#4c7dff] hover:bg-[#3f6ee8] cursor-pointer"
                    :
                    "bg-[#242b3f] cursor-not-allowed"
                  }
                `}

              >

                <Send size={16} className={canSend ? 'text-white' : 'text-gray-500'}/>

              </button>

            </Tooltip.Trigger>


            <Tooltip.Content
              side="top"
              sideOffset={8}
              className={tooltipClass}
            >
              Send message
              <Tooltip.Arrow className="fill-[#1a1f2e]" />
            </Tooltip.Content>


          </Tooltip.Root>



        </div>

      </div>

    </Tooltip.Provider>

  )
}

export default InputArea
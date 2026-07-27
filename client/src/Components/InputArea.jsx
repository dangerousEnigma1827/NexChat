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
    text-xs
    px-3
    py-1.5
    rounded-md
    shadow-lg
    border border-[#2a3142]
  `


  return (

    <Tooltip.Provider delayDuration={300}>

      <div className='w-full px-4 py-3 bg-[#11131a] border-t border-[#2a2f3d] flex justify-center'>
        
        <div className='w-full max-w-5xl bg-[#1a1d27] rounded-2xl px-4 py-3 flex gap-3 shadow-lg items-center'>


          {/* Upload */}

          <Tooltip.Root>

            <Tooltip.Trigger asChild>

              <label className='cursor-pointer'>

                <div className='p-2 rounded-full hover:bg-[#2b3142] transition'>
                  <Plus size={22} className='text-gray-300' />
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
              Attach Files
              <Tooltip.Arrow className="fill-[#1a1f2e]" />
            </Tooltip.Content>


          </Tooltip.Root>






          {/* Text Input */}

          <textarea
            placeholder='Type a message...'
            className='flex-1 bg-transparent resize-none outline-none border-none text-white placeholder:text-gray-500 text-sm max-h-32 min-h-[24px] py-2 leading-6'
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

                disabled={!text?.trim() && imageBlobs.length===0}

                onClick={()=>{

                  if(!text.trim() && imageBlobs.length===0)
                    return

                  sendMessageFunc()

                  setText("")
                  setImageBlobs([])

                }}

                className={`
                  p-2 rounded-full transition
                  ${
                    (text?.trim() || imageBlobs.length>0)
                    ?
                    "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    :
                    "bg-[#2b3142] cursor-not-allowed"
                  }
                `}

              >

                <Send size={18} className='text-white'/>

              </button>

            </Tooltip.Trigger>


            <Tooltip.Content
              side="top"
              sideOffset={8}
              className={tooltipClass}
            >
              Send Message
              <Tooltip.Arrow className="fill-[#1a1f2e]" />
            </Tooltip.Content>


          </Tooltip.Root>



        </div>

      </div>

    </Tooltip.Provider>

  )
}

export default InputArea
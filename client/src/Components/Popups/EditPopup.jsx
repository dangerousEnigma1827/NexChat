import React from 'react'

function EditPopup({messagesToDeleteText, messagesToDeleteTime, setEditedText, handleEdit, setDropArrowdownId, editedText, setEditPopupOpen}) {
  return (
    <>
    <div className='h-screen w-screen fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-[100000]'>
        <div className='h-[65vh] w-[40vw] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-8'>
            <div className='flex flex-col items-center h-full text-white gap-5 px-8 w-[100%]'>
                <h1 className='text-xl font-semibold mb-3'>Edit Message</h1>

                {/* preview of message */}
                <div className='overflow-auto w-full h-[40%] p-4 bg-[#141720] rounded-xl'>
                    <div className='w-full min-h-full flex justify-center items-center'>
                        <div className='group relative min-w-[60%] max-w-[90%] text-white px-4 py-2 break-words bg-blue-500 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'>
                            
                            <p className='text-[15px] leading-relaxed text-white'>
                                {messagesToDeleteText}
                            </p>

                            <div className='flex justify-end mt-1'>
                                <span className='text-[11px] text-gray-300 font-light'>
                                    {new Date(messagesToDeleteTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>


                {/* //edit box */}
                <div className='overflow-auto w-[100%] h-[40%] flex justify-center items-center rounded-xl'>
                    <div className='h-[100%] w-[100%] flex justify-center items-center'>
                        <textarea type="text" placeholder='Write A Message!' className='outline-none border-none rounded-xl text-white max-w-[100%] min-w-[100%] h-[100%] text-md placeholder:text-gray-500 px-4 bg-[#141720]' value={editedText} onChange={(e)=>{
                            setEditedText(e.target.value)
                        }}/>
                    </div>
                </div>


                <div className='flex gap-4'>
                    <button className='px-6 py-2 rounded-md bg-[#2b3142] hover:bg-[#3b4258] transition'
                        onClick={() => {
                            setEditPopupOpen(false)
                            setDropArrowdownId(null)
                        }}>Discard</button>
                    <button className='px-6 py-2 rounded-md bg-blue-500 hover:[] transition' onClick={(e)=>{
                        handleEdit()
                    }}>Edit</button>
                </div>

            </div>

        </div>
    </div>
    </>
  )
}

export default EditPopup
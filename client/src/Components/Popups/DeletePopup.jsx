import React from 'react'
import { TrashIcon } from 'lucide-react'

function DeletePopup({handleDelete, setDeletePopupOpen, setDropArrowdownId, setAttachmentUrlForDeletion}) {
  return (
    <>
        <div className='h-screen w-screen fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm'>
            <div className='w-[28vw] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-8'>
                <div className='flex flex-col items-center text-center text-white'>
                    {/* icon */}
                    <div className='h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-5'>
                        <TrashIcon size={32} color="#f44336" />
                    </div>
                    <h1 className='text-2xl font-semibold mb-2'>Delete Message?</h1>
                    <p className='text-gray-400 text-sm leading-relaxed mb-8 max-w-[90%]'>This message will be deleted.</p>
                    <div className='flex gap-4 w-full'>
                        <button className='flex-1 py-3 rounded-xl bg-[#2b3142] hover:bg-[#3b4258] transition-all duration-200' onClick={() => {setDeletePopupOpen(false) 
                            setDropArrowdownId(null)}}>Cancel</button>
                        <button className='flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200 font-medium' onClick={(e)=>{
                            handleDelete()
                            setDeletePopupOpen(false) 
                            setDropArrowdownId(null)
                            setAttachmentUrlForDeletion("")
                        }}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeletePopup
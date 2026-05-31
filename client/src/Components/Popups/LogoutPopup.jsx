import React from 'react'
import { SignOutIcon } from '@phosphor-icons/react'

function LogoutPopup({handleLogout, setLogoutPopupOpen}) {
  return (
    <>
    <div className='h-screen w-screen fixed inset-0 z-1000 flex justify-center items-center bg-black/40 backdrop-blur-sm'>
        <div className='h-[40vh] w-[30vw] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-8'>
            <div className='flex flex-col justify-center items-center h-full text-white px-8'>

                <div className='h-16 w-16 rounded-full p-2 bg-red-500/20 flex items-center justify-center mb-5'>
                    <SignOutIcon size={32} color="#f44336" />
                </div>

                <h1 className='text-2xl font-semibold mb-3'>Logout from NexChat?</h1>
                <p className='text-gray-400 text-sm text-center mb-8'>You will be logged out.</p>
                <div className='flex gap-4'>
                    <button className='px-6 py-2 rounded-md bg-[#2b3142] hover:bg-[#3b4258] transition'
                        onClick={() => {
                            setLogoutPopupOpen(false)
                        }}>Cancel</button>
                    <button className='px-6 py-2 rounded-md bg-red-500 hover:bg-red-600 transition' onClick={handleLogout}>Logout</button>
                </div>

            </div>
        </div>
    </div>
    </>
  )
}

export default LogoutPopup
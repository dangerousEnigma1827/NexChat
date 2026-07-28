// LogoutPopup.jsx
import React from 'react'
import { SignOutIcon } from '@phosphor-icons/react'

function LogoutPopup({handleLogout, setLogoutPopupOpen}) {
  return (
    <div className='h-screen w-screen fixed inset-0 z-[100000] flex justify-center items-center bg-black/60 backdrop-blur-sm px-4'>
        <div className='w-full max-w-[360px] rounded-xl bg-[#1b2130] border border-[#2a3040] shadow-2xl p-6'>
            <div className='flex flex-col justify-center items-center text-white'>
                <div className='h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4'>
                    <SignOutIcon size={22} className='text-red-400' />
                </div>
                <h1 className='text-[16px] font-semibold mb-1.5'>Log out of NexChat?</h1>
                <p className='text-gray-500 text-[13px] text-center mb-5'>You'll need to sign in again to continue.</p>
                <div className='flex gap-2.5 w-full'>
                    <button className='flex-1 h-[42px] rounded-lg bg-[#242b3f] text-[13.5px] font-medium text-gray-300 hover:bg-[#2b3346] transition-colors duration-150'
                        onClick={() => {
                            setLogoutPopupOpen(false)
                        }}>Cancel</button>
                    <button className='flex-1 h-[42px] rounded-lg bg-red-500 hover:bg-red-600 text-[13.5px] font-medium transition-colors duration-150 shadow-sm' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LogoutPopup
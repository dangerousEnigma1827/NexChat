import React from 'react'

function SelectedGroupOrUser({userSeletedPfp, userSeletedUsername, dropdownOpen, setDropdownOpen, onlineUsers, userSeleted, setClearChatPopupOpen}) {
  return (
    <div className='w-full h-[10vh] bg-[#1d202f] flex items-center gap-4'>
        <div className='rounded-full bg-[#141720] h-[6vh] w-[6vh] flex justify-center items-center ml-6'>
            {
                userSeletedPfp && (
                    <img src={userSeletedPfp} className='h-full w-full object-cover rounded-full' />
                )
            }
            {
                !userSeletedPfp && (
                    <p className='text-white text-md font-medium'>
                        {userSeletedUsername?.substring(0,1).toUpperCase()}
                    </p>
                )
            }
        </div>
        <div className='flex flex-col'>
            <p className='text-xl text-white'>{userSeletedUsername}</p>
            <p className='text-sm text-gray-400'>{onlineUsers.includes(userSeleted) ? "Online" : "Offline"}</p>
        </div>

        {/* three dot wala */}
        <div className='relative ml-auto mr-6'>

            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-white hover:bg-[#2b3142] rounded-md p-2 transition-all" type="button">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M12 6h.01M12 12h.01M12 18h.01"/></svg>
            </button>

            {
                dropdownOpen &&
                <div className="absolute right-0 mt-2 bg-[#232a3a] border border-[#31384d] rounded-md shadow-lg w-44 z-50">
                    <ul className="p-2 text-sm text-gray-300">
                        <li><button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded-md transition-all">View Profile</button></li>
                        <li><button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded-md transition-all" onClick={(e)=>{
                            setClearChatPopupOpen(true)
                        }}>Clear Chat</button></li>
                    </ul>
                </div>
            }
        </div>

    </div>
  )
}

export default SelectedGroupOrUser
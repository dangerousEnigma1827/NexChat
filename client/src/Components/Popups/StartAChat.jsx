import { Search, X } from 'lucide-react'
import React from 'react'

function StartAChat({
  setStartAChat,
  userSearchText,
  setUserSearchText
}) {

  // Handle Search
  const handleSearchUser = () => {

    if (!userSearchText.trim()) return;

    console.log("Searching for:", userSearchText);

    // Your backend API call here
    // axios.get(...)
  }

  return (
    <>
      <div className='h-screen w-screen fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-[100000]'>

        <div className='h-[72vh] w-[32vw] min-w-[420px] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-6'>

          <div className='flex flex-col h-full text-white'>

            <div className='flex justify-between items-center mb-6'>
              <div className='w-[24px]' />
              <h1 className='text-[1.3rem] font-semibold tracking-wide'>Find Users</h1>
              <X size={22} className='text-gray-400 hover:text-red-500 cursor-pointer transition-all duration-300' onClick={() => {
                  setStartAChat(false)
                }}/>
            </div>

            <div className='w-full h-[58px] bg-[#141720] rounded-xl border border-[#2b3245] flex items-center px-4 gap-3 transition-all duration-300'>

              <Search size={20} className='text-gray-400'/>
              <input type="text" value={userSearchText} placeholder='Search users...' className='flex-1 bg-transparent outline-none text-[15px] text-white placeholder:text-gray-500'
                onChange={(e) => {
                  setUserSearchText(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchUser()
                  }
                }}/>

              {
                userSearchText?.length > 0 && (
                  <X size={18} className='text-gray-400 hover:text-red-500 cursor-pointer transition-all duration-300' onClick={() => {
                      setUserSearchText("")
                    }}/>
                )
              }
            </div>

            <button className='w-full h-[52px] bg-[#4c7dff] hover:bg-[#3f6ee8] rounded-xl mt-4 font-medium text-[15px] transition-all duration-300 active:scale-[0.98]' onClick={handleSearchUser}>Search</button>

            <div className='flex-1 mt-5 bg-[#141720] rounded-2xl border border-[#2b3245] overflow-hidden'>
              <div className='w-full h-full flex flex-col justify-center items-center text-gray-500 gap-2'>
                <Search size={32} className='opacity-60' />
                <p className='text-[15px]'>Search for users to start chatting</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default StartAChat
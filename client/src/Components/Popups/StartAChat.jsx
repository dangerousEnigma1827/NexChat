import axios from 'axios'
import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

function StartAChat({setStartAChat,userSearchText, setUserSearchText, currentUserId, setUserSeletec, setUserSeletectedUsername, setUserSeletectedPfp, getAllConversationsInFr}){

  let token = localStorage.getItem('token')
  let [usernameSearchResults, setUsernameSearchResutls] = useState([])
  let [selectedUserFromSearch, setSelectedUserFromSearch] = useState(null)
  let selectedUser;

  const handleSearchUser = async () => {
    try {
      let searchUserFromFr = await axios.post(
        "http://localhost:5000/api/users/search",
        { userSearchText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
     setUsernameSearchResutls(searchUserFromFr.data)
    } catch (err) {
      console.log("error getting user list", err)
    }
  }

  const handlestartConversation = async () => {
    try{
        let startConversationFromFr = await axios.post("http://localhost:5000/api/conversations/add", {
            selectedUserFromSearch:selectedUser
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
    }catch(err){
        console.log("error starting convo from frontend ", err)
    }
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
                    setUserSearchText("")
                    setUsernameSearchResutls([])
                }}/>
            </div>

            <div className='w-full h-[58px] bg-[#141720] rounded-xl border border-[#2b3245] flex items-center px-4 gap-3 transition-all duration-300'>
              <Search size={20} className='text-gray-400' />
              <input type="text" value={userSearchText} placeholder='Search users...' className='flex-1 bg-transparent outline-none text-[15px] text-white placeholder:text-gray-500'
                onChange={(e) => setUserSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchUser()
                }}/>
              {
                userSearchText?.length > 0 && (
                  <X
                    size={18}
                    className='text-gray-400 hover:text-red-500 cursor-pointer transition-all duration-300'
                    onClick={() =>{
                        setUserSearchText("")
                        setUsernameSearchResutls([])
                    }}
                  />
                )
              }

            </div>
            <button
              className='w-full h-[52px] bg-[#4c7dff] hover:bg-[#3f6ee8] rounded-xl mt-4 font-medium text-[15px] transition-all duration-300 active:scale-[0.98]'
              onClick={handleSearchUser}>Search</button>

            <div className='flex-1 mt-5 bg-[#141720] rounded-2xl border border-[#2b3245] overflow-y-auto'>

              {
                usernameSearchResults.length === 0 ? (

                  <div className='w-full h-full flex flex-col justify-center items-center text-gray-500 gap-2'>
                    <Search size={32} className='opacity-60' />
                    <p className='text-[15px]'>Search for users to start chatting</p>
                  </div>
                ) : (
                  <div className='w-[100%] flex flex-col items-center p-2'>
                    {
                      usernameSearchResults.map((user) => {
                        console.log(user._id , " ", currentUserId)
                        return (
                          <div key={user._id} className={`  ${user._id != currentUserId ? '':'hidden'} h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 transition-all duration-300`}
                            onClick={() => {
                                console.log("selected user:", user._id)
                                setSelectedUserFromSearch(user._id)
                                setUserSeletec(user._id)
                                selectedUser = user._id
                                handlestartConversation()
                                
                                getAllConversationsInFr()
                                setStartAChat(false)
                                getAllConversationsInFr()
                                setUserSeletectedUsername(user.username)
                                setUserSeletectedPfp(user.pfp)
                                setUserSearchText("")
                                setUsernameSearchResutls([])
                            }}>

                            <div className='flex items-center gap-4'>
                              <div className='relative'>
                                <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center overflow-hidden'>
                                  {
                                    user.pfp ? (<img src={user.pfp} className='h-full w-full object-cover rounded-full'/>) : (<p className='text-white text-md font-medium'>{user.username?.substring(0, 1).toUpperCase()}</p>)
                                  }
                                </div>
                              </div>

                              <div className='flex flex-col min-w-0'>
                                <p className='text-xl text-white truncate'>{user.username}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              }
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default StartAChat
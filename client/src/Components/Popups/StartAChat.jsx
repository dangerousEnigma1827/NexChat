// StartAChat.jsx
import axios from 'axios'
import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { ConversationContext } from '../../context/conversationContext'
import { UserContext } from '../../context/userContext'
import toast from 'react-hot-toast'
import LoadingSpin from '../LoadingSpin'
import { useContext } from 'react'
import api from '../../api/apiInstance'
import { useEffect } from 'react'
function StartAChat({setStartAChat,userSearchText, setUserSearchText,getAllConversationsInFr, getAllMessagesBwtwo}){

  let {
      conversationId,
      setConversationId,
      setConversationSelected,
      setConversationSelectedtedUsername,
      setConversationSelectedDescription,
      setConversationSelectedtedPfp
  } = useContext(ConversationContext);

  let{
      currentUserId, setUserId
  } = useContext(UserContext)

  let token = localStorage.getItem('token')
  let [usernameSearchResults, setUsernameSearchResutls] = useState([])
  let [selectedUserFromSearch, setSelectedUserFromSearch] = useState(null)
  let selectedUser;

  let [loading, setLoading] = useState({searchLoading:false})
  let [hasSearched, setHasSearched] = useState(false)

  let newConversation="123456";

  const handleSearchUser = async () => {
    setHasSearched(true)
    try {
      setLoading((prev)=> {
        return {...prev, searchLoading:true}
      })


      let searchUserFromFr = await api.post(
        "/users/search",
        { userSearchText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      console.log(searchUserFromFr.data)
     setUsernameSearchResutls(searchUserFromFr.data)
    } catch (err) {
      console.log("error getting user list", err)
    }finally{
      setLoading((prev)=> {
        return {...prev, searchLoading:false}
      })
    }
  }

  const handlestartConversation = async () => {
    try{
        let startConversationFromFr = await axios.post("http://localhost:5000/api/conversations/add", {
            selectedUserFromSearch:selectedUser
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        newConversation = startConversationFromFr.data._id

        getAllConversationsInFr()
        setConversationId(newConversation)
        getAllMessagesBwtwo()
        
        setStartAChat(false)
        setUserSearchText("")
        setUsernameSearchResutls([])
        getAllMessagesBwtwo()

    }catch(err){
        console.log("error starting convo from frontend ", err)
    }
  }

  useEffect(()=>{
    getAllMessagesBwtwo()
  },[conversationId])

  return (
    <>
      <div className='h-screen w-screen fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-[100000] px-4'>
        <div className='h-[68vh] w-full max-w-[420px] rounded-xl bg-[#1b2130] border border-[#2a3040] shadow-2xl p-5'>
          <div className='flex flex-col h-full text-white'>
            <div className='flex justify-between items-center mb-5'>
              <div className='w-6' />
              <h1 className='text-[16px] font-semibold'>Find Users</h1>

              <button
                onClick={() => {
                    setStartAChat(false)
                    setUserSearchText("")
                    setUsernameSearchResutls([])
                }}
                className='w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#242b3f] hover:text-white transition-colors duration-150'
              >
                <X size={17} />
              </button>
            </div>

            <div className='w-full h-[46px] bg-[#141720] rounded-lg border border-[#2a3040] focus-within:border-[#4c7dff]/50 flex items-center px-3.5 gap-2.5 transition-colors duration-150'>
              <Search size={16} className='text-gray-500' />
              <input type="text" value={userSearchText} placeholder='Search users...' className='flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-gray-500'
                onChange={(e) => setUserSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchUser()
                }}/>
              {
                userSearchText?.length > 0 && (
                  <X
                    size={15}
                    className='text-gray-500 hover:text-white cursor-pointer transition-colors duration-150 flex-shrink-0'
                    onClick={() =>{
                        setUserSearchText("")
                        setHasSearched(false)
                        setUsernameSearchResutls([])
                    }}
                  />
                )
              }

            </div>
            <button
              disabled={!userSearchText.trim() || loading.searchLoading}
              className={`w-full disabled:cursor-not-allowed disabled:opacity-40 h-[44px] bg-[#4c7dff] hover:bg-[#3f6ee8] rounded-lg mt-3 font-medium text-[13.5px] transition-colors duration-150 shadow-sm active:scale-[0.98]`}

              onClick={handleSearchUser}>
                {!loading.searchLoading ? 
                  "Search" : 
                  (<div className='flex justify-center items-center gap-2'>
                    <span>Searching...</span>
                    <LoadingSpin />
                  </div>)}
            </button>

            <div className='flex-1 mt-4 bg-[#141720] rounded-lg border border-[#2a3040] overflow-y-auto'>

              {
                !hasSearched && (
                  <div className='w-full h-full flex flex-col justify-center items-center text-gray-500 gap-2 px-6 text-center'>
                    <div className='w-12 h-12 rounded-full bg-[#1d2235] flex items-center justify-center mb-1'>
                      <Search size={20} className='text-gray-600' />
                    </div>
                    <p className='text-[13px]'>Search for users to start chatting</p>
                  </div>
                )
              }

              {
                (userSearchText.trim() != "" && hasSearched && usernameSearchResults.length == 0) && (

                  <div className='w-full h-full flex flex-col justify-center items-center text-gray-500 gap-2 px-6 text-center'>
                    <div className='w-12 h-12 rounded-full bg-[#1d2235] flex items-center justify-center mb-1'>
                      <Search size={20} className='text-gray-600' />
                    </div>
                    <p className='text-[13px]'>No users found</p>
                  </div>
                )
              }


              {
                (hasSearched && usernameSearchResults.length != 0) && (

                  (
                  <div className='w-full flex flex-col items-stretch p-2'>
                    <p className='text-[11.5px] text-gray-500 px-2 mb-1 uppercase tracking-wider font-medium'>{usernameSearchResults.length} result{usernameSearchResults.length > 1 ? "s" : ""} found</p>
                    {
                      usernameSearchResults.map((user) => {
                        return (
                          <div key={user._id} className={`  ${user._id != currentUserId ? '':'hidden'} h-[62px] w-full flex items-center gap-3 mb-1 cursor-pointer hover:bg-[#22283a] rounded-lg px-2.5 transition-colors duration-150`}
                            onClick={() => {
                                setSelectedUserFromSearch(user._id)
                                setConversationSelected(user._id)
                                selectedUser = user._id
                                setConversationSelectedtedUsername(user.username)
                                setConversationSelectedtedPfp(user.pfp)
                                handlestartConversation()
                            }}>

                              <div className='relative flex-shrink-0'>
                                <div className='rounded-full bg-[#141720] h-11 w-11 flex justify-center items-center overflow-hidden ring-1 ring-[#2a3142]'>
                                  {
                                    user.pfp ? (<img src={user.pfp} className='h-full w-full object-cover'/>) : (<p className='text-white text-[14px] font-medium'>{user.username?.substring(0, 1).toUpperCase()}</p>)
                                  }
                                </div>
                              </div>

                              <div className='flex flex-col min-w-0'>
                                <p className='text-[14px] text-gray-100 font-medium truncate'>{user.username}</p>
                              </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
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
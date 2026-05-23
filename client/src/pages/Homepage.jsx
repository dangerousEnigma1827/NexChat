import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, Search, Send, Plus } from "lucide-react";
import {ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon   } from "@phosphor-icons/react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import socket from '../socket/socket';

function HomePage() {

    let token = localStorage.getItem('token')
    let navigate = useNavigate()
    let scrollRef = useRef(null)


    let [users, setUsers] = useState([]);
    let [userSeleted, setUserSeletec] = useState(false)
    let [userSeletedUsername, setUserSeletectedUsername] = useState(false)
    let [userSeletedPfp, setUserSeletectedPfp] = useState(null)
    let [currentUserId, setUserId] = useState(null)

    let [allMessagesBwTwo, setAllMessagesBwTwo] = useState([])
    let [onlineUsers, setOnlineUsers] = useState([])
    let [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    let [dropdownOpen, setDropdownOpen] = useState(false);

    // message schema ke liye
    let [messageType, setMessageText] = useState("text")
    let [text, setText] = useState("")
    let [attachments, setAttachments] = useState([])

    let getAllUsers = async () => {
        try{
            let allUswrsInFrontend = await axios.get('http://localhost:5000/api/auth/allUsers', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(allUswrsInFrontend.data)
            console.log(allUswrsInFrontend.data[0].lastMessageSent)
        }catch(err){
            console.log("error occured getting all users ",err)
        }
    }

    let getCurrentUser = async () => {
        try{
            let getcurrentuserinfo = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUserId(getcurrentuserinfo.data._id)
        }catch(err){
            console.log("error occured getting current user", err);
        }
    }

    let getAllMessagesBwtwo = async () =>{
        try{
            let getallmessagesinfr = await axios.get(`http://localhost:5000/api/messages/getMessages/${currentUserId}/${userSeleted}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setAllMessagesBwTwo(getallmessagesinfr.data)
            console.log(getallmessagesinfr.data)
        }catch(err){
            console.log("error getting messages between two users", err)
        }
    }

    let sendMessageFunc = async () => {
        try{
            let sendMessageFromFrontend = await axios.post(
                "http://localhost:5000/api/messages/send", 
                {
                    text:text, 
                    senderId:currentUserId,
                    recieverId: userSeleted,
                    attachments:attachments
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setAllMessagesBwTwo((prev)=>{
                return [...prev, {
                    text:text, 
                    senderId:currentUserId,
                    recieverId: userSeleted,
                    attachments:attachments
                }]
            })

            setText("")
            setAttachments([])
        }catch(err){
            console.log("error sending message from frontned", err)
        }
    }

    let handleLogout = async () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    let handleClearChat = async (req,res) => {
        try{
            let clearcharsBwTwo = await axios.post(`http://localhost:5000/api/messages/clearchat/${currentUserId}/${userSeleted}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log("cleared chat")
        }catch(err){
            console.log("error clearing chats in frotnend", err)
        }
    }

    let handleMedia = async (e) => {
        let files = e.target.files;

        let tempArr = []
        for(let file of files){
            let data = new FormData();

            data.append("file", file);
            data.append("upload_preset", "NexChatUploadPreset");
            data.append("cloud_name", "dgv5nxqxx");

            let res = await fetch(
                "https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload",
                {
                    method:"POST",
                    body:data
                }
            );

            let mediaUploadUrl = await res.json();
            console.log(mediaUploadUrl)

            if(file.type.includes("image")){
                tempArr.push({
                    url:mediaUploadUrl.url || mediaUploadUrl.secure_url ,
                    type:"image"
                })
            }else if(file.type.includes("video")){
                tempArr.push({
                    url:mediaUploadUrl.url || mediaUploadUrl.secure_url,
                    type:"video"
                })
            }
        }
        setAttachments(tempArr)

        setAllMessagesBwTwo((prev)=>{
            return [...prev, {
                text:text, 
                senderId:currentUserId,
                recieverId: userSeleted,
                attachments:tempArr
            }]
        })

        let sendMessageToBackend = await axios.post('http://localhost:5000/api/messages/send', {
            text:text, 
            senderId:currentUserId,
            recieverId: userSeleted,
            attachments : tempArr
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                } 
        
            }
        )
        setAttachments([])
        setText("")
    }

    useEffect(()=>{
        getCurrentUser()
        getAllUsers()
    },[])

    useEffect(()=>{
        if(userSeleted && currentUserId){
            getAllMessagesBwtwo()
        }
    }, [userSeleted, currentUserId])

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [allMessagesBwTwo])

    useEffect(()=>{
        socket.connect()

        socket.on("connect", ()=>{
            socket.emit("join", currentUserId);
        })

        socket.on("recieve_message", (messageData)=>{
            console.log("got this shi", messageData)
            setAllMessagesBwTwo((prev)=>{
                return [...prev, messageData]
            })
        })

        socket.on('online_users', (onlineUsers)=>{
            setOnlineUsers(onlineUsers);
        })

        return ()=>{
            socket.off("connect");
            socket.off("recieve_message")
        }
    }, [currentUserId])

    

  return (
    //top most parent
    <div>
        {/* logout popup */}
        {
            logoutPopupOpen && 
            <div className='h-screen w-screen fixed inset-0 z-1000 flex justify-center items-center bg-black/40 transition-all duration-500 ease-in-out '>

                <div className='h-[40vh] w-[30vw] rounded-md bg-[#232a3a]'>

                    <div className='flex flex-col justify-center items-center h-full text-white px-8'>

                        <h1 className='text-2xl font-semibold mb-3'>Logout from NexChat?</h1>
                        <p className='text-gray-400 text-sm text-center mb-8'>You will need to login again to access your chats and messages.</p>

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
        }


        <div className='flex w-full h-screen'>
            <div className='w-[4vw] min-h-[100vh] bg-[#141720] flex flex-col items-center justify-between '>
                <div className='mt-6 mb-6 h-screen flex flex-col justify-between'>
                    <ChatCircleTextIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' />
                    <SignOutIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' onClick={(e)=>{
                        setLogoutPopupOpen(true)
                    }} />

                </div>
            </div>

            <div className='w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center'>
            {/* //inner content */}
            <div className='w-[90%] mt-5'>
                <div className='flex gap-2 items-center w-[100%] mb-5'>
                    <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='' />
                    <p className='text-white title text-3xl font-normal '>NexChat</p>
                </div>

                {/* search bar */}
                <div className='w-[100%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <Search className='text-white ml-4' size={19}/>
                    <input type="text" placeholder='Seach Chats' className='outline-none bg-transparent text-white  h-[8vh] text-md placeholder:text-gray-500'/>
                </div>

                <div className='w-[100%] mt-6 flex flex-col items-center overflow-y-auto h-[75vh]'>
                    {
                        users.map((user, index)=>{
                            return <div key={user._id} className={`h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all ${user._id == userSeleted ? "bg-[#2b3142]" : ""}`} onClick={(e)=>{
                                setUserSeletec(user._id)
                                setUserSeletectedUsername(user.username)
                                setUserSeletectedPfp(user.pfp)
                                console.log(user)
                            }}>
                               <div className='flex items-center gap-4 '>

                                    <div className='relative'>
                                        <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center text-center '>
                                            
                                            {user.pfp && <img src={user.pfp} className='h-full w-full object-cover rounded-full' />}
                                            {
                                                !user.pfp && (
                                                    <p className='text-white text-md font-medium'>
                                                        {user.username?.substring(0,1).toUpperCase()}
                                                    </p>
                                                )
                                            }
                                        </div>
                                        {
                                            onlineUsers.includes(user._id) && (
                                                <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#212634]'></div>
                                            )
                                        }
                                    </div>

                                    <div className='flex flex-col min-w-0'>
                                        <div className='flex justify-between items-center'>
                                            <p className='text-xl text-white'>{user.username}</p>
                                        
                                            <div className={`${user.lastTimeMessageSent[currentUserId] ? "text-[#64748b] opacity-100" : "text-blue-600 opacity-0"}`}>
                                                <p>{new Date(user.lastTimeMessageSent[currentUserId]).toLocaleTimeString([], {
                                                    hour:"2-digit",
                                                    minute:"2-digit"
                                                })}</p>
                                            </div>
                                        </div>

                                        <p className='text-[#94A3b8] font-sm truncate max-w-[250px]'>{user.lastMessageSent[currentUserId]}</p>
                                    </div>
                               </div>
                               
                            </div>
                        })
                    }
                </div>
            </div>
        </div>

            <div className='w-[71vw] bg-[#141720] min-h-[100vh]'>
                {
                    !userSeleted && <div>
                    </div>
                }
                {
                    userSeleted && <div className=''>
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
                                                setDropdownOpen(false)
                                                handleClearChat()
                                                getAllMessagesBwtwo()
                                            }}>Clear Chat</button></li>
                                        </ul>
                                    </div>
                                }
                            </div>

                        </div>

                        <div className='h-[80vh] w-full overflow-y-auto'>
                            <div className='w-full py-6 pb-6'>
                                {
                                allMessagesBwTwo.map((message, index)=>{
                                    return <div key={message._id}>
                                        {
                                            message.attachments?.length != 0 && (
                                                    message.attachments?.map((attachment, index)=>{
                                                        return (
                                                            <div key={index} className={`w-full flex mb-1 ${ message.senderId === currentUserId? "justify-end": "justify-start"}`}>
                                                                <div className={`max-w-[45%] p-1 ${ message.senderId === currentUserId? "bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl": "bg-[#1d202f] ml-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"}`}>
                                                                    {
                                                                        attachment.type == "image" && <img src={attachment.url} alt="chat-image" className='rounded-xl max-h-[350px] object-cover'/>
                                                                    }
                                                                    <div className='flex justify-end mt-1'>
                                                                        <span className='text-[11px] text-gray-300 font-light'>
                                                                            {
                                                                                new Date(message.createdAt).toLocaleTimeString([], {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                            )
                                        }
                                        
                                        { message.text != "" && 
                                            (<div className={`w-full flex mb-1 ${ message.senderId === currentUserId? "justify-end": "justify-start"}`}>
                                                <div className={`max-w-[45%] px-4 py-3 text-white break-words ${message.senderId === currentUserId? "bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl": "bg-[#1d202f] ml-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"}`}>
                                                    <p className='text-[15px] leading-relaxed'>{message.text}</p>
                                                    <div className='flex justify-end mt-1'>
                                                        {/* time ka part */}
                                                        <span className='text-[11px] text-gray-300 font-light'>
                                                            {
                                                                new Date(message.createdAt)
                                                                .toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>)
                                        }

                                    </div>
                                })
                            }
                            <div className="scrollbelow" ref={scrollRef}></div>
                            </div>
                        </div>

                            {/* input wala */}
                        <div className='w-full h-[10vh] bg-[#1d202f] flex items-center justify-center'>
                            <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                                <label>
                                    <Plus className='text-white cursor-pointer ml-6' />
                                    <input type="file" className='hidden' multiple onChange={(e)=>{
                                        // console.log(e.target.files)
                                        handleMedia(e)
                                    }}/>
                                </label>
                                <input type="text" placeholder='Write A Message!' className='outline-none  text-white w-[95%]  h-[8vh] text-md placeholder:text-gray-500 px-4 bg-transparent' value={text} onChange={(e)=>{setText(e.target.value)}} onKeyDown={(e)=>{
                                    if(e.key == "Enter"){
                                        sendMessageFunc()
                                        setText("")
                                    }
                                }}/>
                                <Send className={`text-white mr-6 ${text?.trim() != "" ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={(e)=>{
                                    sendMessageFunc()
                                    setText("")
                                }}/>
                            </div>
                        </div>

                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default HomePage
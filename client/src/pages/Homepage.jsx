import React, { useEffect, useState } from 'react'
import { MessageCircle, Search, Send, Plus } from "lucide-react";
import {ChatsCircleIcon, ChatCircleTextIcon} from "@phosphor-icons/react"
import axios from 'axios'
import socket from '../socket/socket';

function HomePage() {

    let [users, setUsers] = useState([]);
    let token = localStorage.getItem('token')
    let [userSeleted, setUserSeletec] = useState(false)
    let [userSeletedUsername, setUserSeletectedUsername] = useState(false)
    let [currentUserId, setUserId] = useState(null)
    let [message, setMessage] = useState("")
    let [allMessagesBwTwo, setAllMessagesBwTwo] = useState([])

    let getAllUsers = async () => {
        try{
            let allUswrsInFrontend = await axios.get('http://localhost:5000/api/auth/allUsers', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(allUswrsInFrontend.data)
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
                    message:message, 
                    senderId:currentUserId,
                    recieverId: userSeleted
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setAllMessagesBwTwo((prev)=>{
                return [...prev, {
                    message:message, 
                    senderId:currentUserId,
                    recieverId: userSeleted
                }]
            })
        }catch(err){
            console.log("error sending message from frontned", err)
        }
    }

    useEffect(()=>{
        getCurrentUser()
        getAllUsers()
    },[])

    useEffect(()=>{
        getAllMessagesBwtwo()
    }, [userSeleted])

    useEffect(()=>{
        socket.connect()

        socket.on("connect", ()=>{
            socket.emit("join", currentUserId);
        })
        console.log("2")

        socket.on("recieve_message", (messageData)=>{
            console.log("got this shi", messageData)
            setAllMessagesBwTwo((prev)=>{
                return [...prev, messageData]
            })
        })

        return ()=>{
            socket.off("connect");
            socket.off("recieve_message")
        }
    }, [currentUserId])

    

  return (
    //top most parent
    <div className='flex w-full h-screen'>

        <div className='w-[4vw] min-h-[100vh] bg-[#141720] flex flex-col items-center '>
            <div className='mt-6'>
                <ChatCircleTextIcon size={25} color="#ffffff" weight="fill" className='cursor-pointer' />
            </div>
        </div>

        <div className='w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center'>
            {/* //inner content */}
            <div className='w-[80%] mt-5'>
                <div className='flex gap-2 items-center w-[100%] mb-5'>
                    <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='' />
                    <p className='text-white title text-3xl font-normal '>NexChat</p>
                </div>

                {/* search bar */}
                <div className='w-[100%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <Search className='text-white ml-4' size={19}/>
                    <input type="text" placeholder='Seach Chats' className='outline-none bg-transparent text-white  h-[8vh] text-md placeholder:text-gray-500'/>
                </div>

                <div className='w-[100%] mt-6 flex flex-col items-center'>
                    {
                        users.map((user, index)=>{
                            return <div className='h-[7vh] w-[100%] flex items-center mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all' onClick={(e)=>{
                                setUserSeletec(user._id)
                                setUserSeletectedUsername(user.username)
                            }}>
                                <div className='rounded-full bg-[#141720] h-[6vh] w-[6vh] flex justify-center items-center'>
                                    <p className='text-white text-xl'>{user.username.substring(0,1)}</p>
                                </div>
                                <p className='text-xl text-white'>{user.username}</p>
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
                            <p className='text-white text-xl'>{userSeletedUsername.substring(0,1)}</p>
                        </div>
                        <p className='text-xl text-white'>{userSeletedUsername}</p>
                    </div>

                    <div className='h-[80vh] w-full overflow-y-auto'>
                        <div className='w-full py-6 pb-6'>
                            {
                            allMessagesBwTwo.map((message, index)=>{
                                return <div key={message._id}>
                                    {/* message */}
                                    <div className={`w-full flex mb-4 ${ message.senderId === currentUserId? "justify-end": "justify-start"}`}>

                                        <div className={`max-w-[45%] px-4 py-3 text-white break-words ${message.senderId === currentUserId? "bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl": "bg-[#1d202f] ml-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"}`}>
                                            {/* main text */}
                                            <p className='text-[15px] leading-relaxed'>{message.message}</p>
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

                                    </div>

                                </div>
                            })
                        }
                        </div>
                    </div>

                        {/* input wala */}
                    <div className='w-full h-[10vh] bg-[#1d202f] flex items-center justify-center'>
                        <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                            <Plus className='text-white cursor-pointer ml-6'/>
                            <input type="text" placeholder='Write A Message!' className='outline-none  text-white w-[95%]  h-[8vh] text-md placeholder:text-gray-500 px-4 bg-transparent' value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
                            <Send className='text-white cursor-pointer mr-6' onClick={(e)=>{
                                sendMessageFunc()
                                setMessage("")
                            }}/>
                        </div>
                    </div>

                </div>
               }
        </div>

    </div>
  )
}

export default HomePage
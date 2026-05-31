import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, Search, Send, Plus } from "lucide-react";
import {ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon,TrashIcon   } from "@phosphor-icons/react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import socket from '../socket/socket';
import SelectedGroupOrUser from '../Components/SelectedGroupOrUser';
import UserListBar from '../Components/UserListBar';
import InputArea from '../Components/InputArea';
import NexChatIcon from '../Components/NexChatIcon';
import LeftMostBar from '../Components/LeftMostBar';

function HomePage() {

    let token = localStorage.getItem('token')
    let navigate = useNavigate()
    let scrollRef = useRef(null)
    let dropdownref = useRef(null)


    let [users, setUsers] = useState([]);
    let [userSeleted, setUserSeletec] = useState(false)
    let [userSeletedUsername, setUserSeletectedUsername] = useState(false)
    let [userSeletedPfp, setUserSeletectedPfp] = useState(null)
    let [currentUserId, setUserId] = useState(null)

    let [allMessagesBwTwo, setAllMessagesBwTwo] = useState([])
    let [onlineUsers, setOnlineUsers] = useState([])

    //popups state
    let [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    let [deletePopupOpen, setDeletePopupOpen] = useState(false);
    let [clearChatPopupOpen, setClearChatPopupOpen] = useState(false);
    let [editPopupOpen, setEditPopupOpen] = useState(true);


    let [dropdownOpen, setDropdownOpen] = useState(false);
    let [dropArrowdownOpen, setDropArrowdownOpen] = useState(false);
    let [dropArrowdownId, setDropArrowdownId] = useState(null);


    let [messageToDelete, setMessageToDelete] = useState(null);
    let [attachmentUrlForDeletion , setAttachmentUrlForDeletion] = useState("")

    // message schema ke liye
    let [messageType, setMessageText] = useState("text")
    let [text, setText] = useState("")
    let [attachments, setAttachments] = useState([])

    //edit states
    let [messagesToDeleteText, setMessageToDeleteText] = useState("")
    let [messagesToDeleteTime, setMessageToDeleteTime] = useState()

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
                    attachments:attachments,
                    
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setAllMessagesBwTwo((prev)=>{
                return [...prev, sendMessageFromFrontend.data]
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
            let clearcharsBwTwo = await axios.post(`http://localhost:5000/api/messages/clearchat/${currentUserId}/${userSeleted}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )

            getAllMessagesBwtwo()

            console.log("cleared chat")
        }catch(err){
            console.log("error clearing chats in frotnend", err)
        }
    }

    let uploadFile = async (file) => {
        let data = new FormData();

        data.append("file", file);
        data.append("upload_preset", "NexChatUploadPreset");
        data.append("cloud_name", "dgv5nxqxx");

        let cloudinaryBaseUrl = 
            file.type.includes("image") ? "https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload" : "https://api.cloudinary.com/v1_1/dgv5nxqxx/video/upload";
        
        let res = await fetch(
            cloudinaryBaseUrl,
            {
                method:"POST",
                body:data
            }
        );

        let resObj = await res.json()

        return{
            url:resObj.secure_url || resObj.url,
            type : file.type.includes("image") ? "image" : "video",
            isDeletedForEveryone:false
        }
    }



    let handleMedia = async (e) => {
        let files = Array.from(e.target.files);
        let tempArr = []
        tempArr = await Promise.all(
            files.map((file)=>{
                return uploadFile(file);
            })
        )
        setAttachments(tempArr)
        
        let sendMessageToBackend = await axios.post('http://localhost:5000/api/messages/send', {
            text:text, 
            senderId:currentUserId,
            recieverId: userSeleted,
            attachments : tempArr
            },
            {headers: {Authorization: `Bearer ${token}`} }
        )

        setAllMessagesBwTwo((prev)=>{
            return [...prev, sendMessageToBackend.data]
        })
        setAttachments([])
        setText("")
    }



    let handleDelete = async (e) => {
        try{
            console.log(messageToDelete)
            console.log(attachmentUrlForDeletion)

            let typeOf = messageToDelete.startsWith("http") ? "attachment" : "text";
            
            if(attachmentUrlForDeletion){
                console.log("attachment")
                typeOf = "attachment"
            }else{
                console.log("text")
                typeOf = "text"
            }

            let deletefromfr = await axios.delete(`http://localhost:5000/api/messages/delete`,
                {
                    data:{
                        typeOf,
                        messageToDelete,
                        attachmentUrlForDeletion
                    },
                        headers:{Authorization: `Bearer ${token}`}
                }
            )
            console.log("4")
            console.log(deletefromfr.data)
            getAllMessagesBwtwo();

        }catch(err){
            console.log("error deleting from frontend", err)
        }
    }

    let handleEdit = async () => {
        let editMessageFromFr = await axios.post('http://localhost:5000/api/messages/edit', {

        }, 
        {
            headers:{Authorization: `Bearer ${token}`}
        })
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


    // useEffect(()=>{
    //     let handleClick = (e) => {
    //         if(!dropdownref?.current?.contains(e.target)){
    //             setDropArrowdownId(null)
    //         }
    //     }
        
    //     document.addEventListener('mousedown', handleClick);


    //     return () => {
    //         document.removeEventListener('mousedown', handleClick)
    //     }
    // }, [dropArrowdownId])

    

  return (
    //top most parent
    <div>
        {
            logoutPopupOpen && 
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
        }

        {
            deletePopupOpen && 
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
        }

        {
            clearChatPopupOpen && 
            <div className='h-screen w-screen fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-sm'>
                <div className='w-[28vw] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-8'>
                    <div className='flex flex-col items-center text-center text-white'>
                        {/* icon
                        <div className='h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-5'>
                            <TrashIcon size={32} color="#f44336" />
                        </div> */}
                        <h1 className='text-2xl font-semibold mb-2'>Clear Chat?</h1>
                        <p className='text-gray-400 text-sm leading-relaxed mb-8 max-w-[90%]'>All these messages will be deleted.</p>
                        <div className='flex gap-4 w-full'>
                            <button className='flex-1 py-3 rounded-xl bg-[#2b3142] hover:bg-[#3b4258] transition-all duration-200' onClick={() => {
                                setClearChatPopupOpen(false)
                                setDropdownOpen(false)
                                }}>Cancel</button>
                            <button className='flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200 font-medium' onClick={(e)=>{
                                setClearChatPopupOpen(false)
                                setDropdownOpen(false)
                                handleClearChat()
                                getAllMessagesBwtwo()
                            }}>Clear Chat</button>
                        </div>
                    </div>
                </div>

            </div>
        }

        {
            editPopupOpen && 
            <div className='h-screen w-screen fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-[100000]'>
                <div className='h-[60vh] w-[30vw] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-8'>
                    <div className='flex flex-col items-center h-full text-white px-8'>
                        <h1 className='text-xl font-semibold mb-3'>Edit Message</h1>

                        {/* preview of message */}
                        <div className='overflow-auto bg-red-500 w-[28vw] h-[40%] flex justify-center items-center'>
                            <div className='h-[100%] w-[80%] flex justify-center items-center py-5'>

                                <div className={`group relative overflow-visible min-w-[60%] my-200 text-white px-4 py-2 break-words bg-blue-500 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl min-h-[100%] `}>

                                    <p className={`text-[15px] leading-relaxed text-white`}>{messagesToDeleteText}</p>
                                    <div className='flex justify-end mt-1'>
                                        <span className='text-[11px] text-gray-300 font-light'>
                                            {new Date(messagesToDeleteTime).toLocaleTimeString([],{
                                                hour:"2-digit",
                                                minute : "2-digit"
                                            })}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        </div>


                        {/* //edit box */}
                        <div className='overflow-auto bg-pink-500 w-[28vw] h-[40%] flex justify-center items-center'>
                            <div className='h-[80%] w-[80%] flex justify-center items-center'>

                                {/* <div className={`group relative overflow-visible min-w-[60%] px-4 py-3 text-white break-words bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl `}>

                                    <p className={`text-[15px] leading-relaxed text-white`}>{messagesToDeleteText}</p>
                                    <div className='flex justify-end mt-1'>
                                        <span className='text-[11px] text-gray-300 font-light'>
                                            {new Date(messagesToDeleteTime).toLocaleTimeString([],{
                                                hour:"2-digit",
                                                minute : "2-digit"
                                            })}
                                        </span>
                                    </div>

                                </div> */}

                            </div>
                        </div>


                        <div className='flex gap-4'>
                            <button className='px-6 py-2 rounded-md bg-[#2b3142] hover:bg-[#3b4258] transition'
                                onClick={() => {
                                    setEditPopupOpen(false)
                                }}>Discard</button>
                            <button className='px-6 py-2 rounded-md bg-blue-500 hover:[] transition'>Edit</button>
                        </div>

                    </div>

                </div>

            </div>
        }


        <div className='flex w-full h-screen'>
            
            <LeftMostBar setLogoutPopupOpen={setLogoutPopupOpen}/>

            <div className='w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center'>
                <div className='w-[90%] mt-5'>
                    <NexChatIcon/>

                    {/* //users list */}
                    <UserListBar users={users} userSeleted={userSeleted} setUserSeletec={setUserSeletec} setUserSeletectedUsername={setUserSeletectedUsername} setUserSeletectedPfp={setUserSeletectedPfp} onlineUsers={onlineUsers}/>
                </div>
            </div>

            <div className='w-[71vw] bg-[#141720] min-h-[100vh]'>
                {
                    !userSeleted && <div>
                    </div>
                }
                {
                    userSeleted && <div className=''>
                        
                        <SelectedGroupOrUser userSeletedPfp={userSeletedPfp} userSeletedUsername={userSeletedUsername} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} onlineUsers={onlineUsers} userSeleted={userSeleted} setClearChatPopupOpen={setClearChatPopupOpen}/>

                        <div className='h-[80vh] w-full overflow-y-auto'>
                            <div className='w-full py-6 pb-6'>
                                {
                                allMessagesBwTwo.map((message, index)=>{
                                    return <div key={message._id}>
                                        {
                                            message.attachments?.length != 0 && (
                                                message.attachments?.map((attachment, index)=>{
                                                   return (
                                                        <div key={index} className={`w-full flex mb-2 ${message.senderId === currentUserId? "justify-end": "justify-start"}`} ref={dropdownref}>
                                                            <div className={`group relative overflow-visible max-w-[45%] p-1 ${
                                                                message.senderId === currentUserId
                                                                ? "bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                                                                : "bg-[#1d202f] ml-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
                                                            }`}>

                                                                <div >
                                                                    <button 
                                                                        onClick={() => {
                                                                            if(dropArrowdownId == null){
                                                                                setDropArrowdownId(attachment.url)
                                                                                console.log("set")
                                                                            }
                                                                            else setDropArrowdownId(null)

                                                                            setMessageToDelete(message._id)
                                                                            setAttachmentUrlForDeletion(attachment.url)
                                                                        }}
                                                                        className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-[#232a3a] rounded-full p-1 transition-all duration-200 z-20 ${
                                                                            message.senderId === currentUserId
                                                                            ? "-left-6"
                                                                            : "-right-6"
                                                                        }`}>
                                                                        <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                                                                        </svg>
                                                                    </button>

                                                                    {
                                                                        dropArrowdownId == attachment.url && message.senderId == currentUserId && (
                                                                            <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${message.senderId === currentUserId? "-left-56": "-right-56"}`}>
                                                                                <div className="p-2 text-sm text-gray-300 font-medium">
                                                                                    <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] text-white rounded transition-all" onClick={(e)=>{
                                                                                        setDeletePopupOpen(true)
                                                                                    }}>Delete For All</button>
                                                                                    <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] text-white rounded transition-all" onClick={(e)=>{
                                                                                        console.log("1")
                                                                                        setDeletePopupOpen(true)
                                                                                    }}>Delete For Me</button>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {
                                                                        dropArrowdownId == attachment.url && message.senderId != currentUserId && (
                                                                            <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
                                                                                message.senderId === currentUserId
                                                                                ? "-left-56"
                                                                                : "-right-56"
                                                                            }`}>
                                                                                <div className="p-2 text-sm text-gray-300 font-medium">
                                                                                    <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
                                                                                        setDeletePopupOpen(true)
                                                                                    }}>Delete For Me</button>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }

                                                                </div>

                                                                {
                                                                    attachment.type == "image" && !attachment.isDeletedForEveryone && (
                                                                        <img src={attachment.url}  alt="chat-image"  className='cursor-pointer rounded-xl max-h-[350px] object-cover'/>
                                                                    )
                                                                }
                                                                {
                                                                    attachment.type == "image" && attachment.isDeletedForEveryone && (
                                                                        <p className={`text-[15px] leading-relaxed text-gray-300 italic opacity-70 p-1`}>
                                                                        This Message Was Deleted
                                                                        </p>
                                                                    )
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
                                                <div className={`group relative overflow-visible max-w-[45%] px-4 py-3 text-white break-words ${
                                                    message.senderId === currentUserId ? "bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl": "bg-[#1d202f] ml-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"}`}>

                                                    <div ref={dropdownref}>
                                                        <button
                                                            onClick={() =>  {
                                                                if(dropArrowdownId == null) setDropArrowdownId(message._id)
                                                                else setDropArrowdownId(null)

                                                                setMessageToDelete(message._id)
                                                                setAttachmentUrlForDeletion("")
                                                            }}
                                                            className={`absolute top-1/2 -translate-y-1/2 opacity-0 ${message.isDeletedForEveryone == false ? "group-hover:opacity-100 hover:opacity-100" : "opacity-0"} bg-[#232a3a] rounded-full p-1 transition-all duration-200 z-20 ${
                                                                message.senderId === currentUserId
                                                                ? "-left-6"
                                                                : "-right-6"
                                                            }`}>
                                                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                                                        </button>

                                                        {
                                                            dropArrowdownId == message._id && message.senderId == currentUserId  &&(
                                                                <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
                                                                    message.senderId === currentUserId
                                                                    ? "-left-56"
                                                                    : "-right-56"
                                                                }`}>
                                                                    <div className="p-2 text-sm text-gray-300 font-medium">
                                                                        <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
                                                                            setEditPopupOpen(true)
                                                                            setMessageToDeleteText(message.text)
                                                                            setMessageToDeleteTime(message.createdAt)
                                                                        }}>Edit</button>
                                                                    </div>
                                                                    <div class="p-2 text-sm text-body font-medium">
                                                                        <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
                                                                            setDeletePopupOpen(true)
                                                                        }}>Delete For All</button>
                                                                        <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
                                                                            setDeletePopupOpen(true)
                                                                        }}>Delete For Me</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            dropArrowdownId == message._id && message.senderId != currentUserId && (
                                                                <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
                                                                    message.senderId === currentUserId
                                                                    ? "-left-56"
                                                                    : "-right-56"
                                                                }`}>
                                                                    <div className="p-2 text-sm text-gray-300 font-medium">
                                                                        <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
                                                                            setDeletePopupOpen(true)
                                                                        }}>Delete For Me</button>
                                                                    </div>
                                                                    <div class="p-2 text-sm text-body font-medium">
                                                                        {/* seperated line contned ehre */}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                    <p className={`text-[15px] leading-relaxed ${message.isDeletedForEveryone? "text-gray-300 italic opacity-70": "text-white"}`}>
                                                        {message.text}
                                                    </p>

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
                                            </div>)
                                        }

                                    </div>
                                })
                            }

                            <div className="scrollbelow" ref={scrollRef}></div>
                            </div>

                        </div>

                        <InputArea text={text} setText={setText} sendMessageFunc={sendMessageFunc} handleMedia={handleMedia} />
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default HomePage
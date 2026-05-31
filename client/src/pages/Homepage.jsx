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
import OneMessage from '../Components/OneMessage';
import LogoutPopup from '../Components/Popups/LogoutPopup';

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
    let [editPopupOpen, setEditPopupOpen] = useState(false);


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
    let [editedText, setEditedText] = useState("")

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
        try{
            let editMessageFromFr = await axios.post('http://localhost:5000/api/messages/edit', {
                messageId:dropArrowdownId,
                editedText
            }, 
            {
                headers:{Authorization: `Bearer ${token}`}
            })

            console.log(editMessageFromFr);
            getAllMessagesBwtwo()
            setEditPopupOpen(false)
            setDropArrowdownId(null)
            console.log("done editing")
        }catch(err){
            console.log("error occured editing from frontend ", err)
        }
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
            <LogoutPopup handleLogout={handleLogout} setLogoutPopupOpen={setLogoutPopupOpen}/>
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
                <div className='h-[65vh] w-[40vw] rounded-2xl bg-[#232a3a] border border-[#31384d] shadow-2xl p-8'>
                    <div className='flex flex-col items-center h-full text-white gap-5 px-8 w-[100%]'>
                        <h1 className='text-xl font-semibold mb-3'>Edit Message</h1>

                        {/* preview of message */}
                        <div className='overflow-auto w-full h-[40%] p-4 bg-[#141720] rounded-xl'>
                            <div className='w-full min-h-full flex justify-center items-center'>
                                <div className='group relative min-w-[60%] max-w-[90%] text-white px-4 py-2 break-words bg-blue-500 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'>
                                    
                                    <p className='text-[15px] leading-relaxed text-white'>
                                        {messagesToDeleteText}
                                    </p>

                                    <div className='flex justify-end mt-1'>
                                        <span className='text-[11px] text-gray-300 font-light'>
                                            {new Date(messagesToDeleteTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>


                        {/* //edit box */}
                        <div className='overflow-auto w-[100%] h-[40%] flex justify-center items-center rounded-xl'>
                            <div className='h-[100%] w-[100%] flex justify-center items-center'>
                                <textarea type="text" placeholder='Write A Message!' className='outline-none border-none rounded-xl text-white max-w-[100%] min-w-[100%] h-[100%] text-md placeholder:text-gray-500 px-4 bg-[#141720]' value={editedText} onChange={(e)=>{
                                    setEditedText(e.target.value)
                                }}/>
                            </div>
                        </div>


                        <div className='flex gap-4'>
                            <button className='px-6 py-2 rounded-md bg-[#2b3142] hover:bg-[#3b4258] transition'
                                onClick={() => {
                                    setEditPopupOpen(false)
                                    setDropArrowdownId(null)
                                }}>Discard</button>
                            <button className='px-6 py-2 rounded-md bg-blue-500 hover:[] transition' onClick={(e)=>{
                                handleEdit()
                            }}>Edit</button>
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
                                    return <OneMessage message={message} dropdownref={dropdownref} dropArrowdownId={dropArrowdownId} setDropArrowdownId={setDropArrowdownId} setAttachmentUrlForDeletion={setAttachmentUrlForDeletion} setDeletePopupOpen={setDeletePopupOpen} currentUserId={currentUserId} setMessageToDelete={setMessageToDelete}/>
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
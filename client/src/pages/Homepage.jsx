import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, Search, Send, Plus } from "lucide-react";
import {ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon,TrashIcon   } from "@phosphor-icons/react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import socket from '../socket/socket';
import SelectedGroupOrUser from '../Components/SelectedGroupOrUser';
import ConversationListBar from '../Components/ConversationListBar';
import InputArea from '../Components/InputArea';
import NexChatIcon from '../Components/NexChatIcon';
import LeftMostBar from '../Components/LeftMostBar';
import OneMessage from '../Components/OneMessage';
import LogoutPopup from '../Components/Popups/LogoutPopup';
import DeletePopup from '../Components/Popups/DeletePopup';
import ClearChatPopup from '../Components/Popups/ClearChatPopup';
import EditPopup from '../Components/Popups/EditPopup';
import StartAChat from '../Components/Popups/StartAChat';

function HomePage() {

    let token = localStorage.getItem('token')
    let navigate = useNavigate()
    let scrollRef = useRef(null)
    let dropdownref = useRef(null)


    let [users, setUsers] = useState([]);
    let [conversations, setConversations] = useState([]);
    let [userSeleted, setUserSeletec] = useState(null)
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
    let [startAChat, setStartAChat] = useState(false)


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


    //start chat ke liye 
    let [userSearchText, setUserSearchText] = useState("")

    let [conversationId, setConversationId] = useState(null)

    let getAllConversationsInFr = async () => {
        try{
            let getAllConversationsInFrReq = await axios.get('http://localhost:5000/api/conversations/', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setConversations(getAllConversationsInFrReq.data)
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
            let getallmessagesinAConvofr = await axios.get(`http://localhost:5000/api/conversations/allMessagesOfAConversation/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAllMessagesBwTwo(getallmessagesinAConvofr.data)
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
                    conversationId,
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

            let typeOf = messageToDelete.startsWith("http") ? "attachment" : "text";
            
            if(attachmentUrlForDeletion){
                typeOf = "attachment"
            }else{
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
        getAllConversationsInFr()
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
            <DeletePopup handleDelete={handleDelete} setDeletePopupOpen={setDeletePopupOpen} setDropArrowdownId={setDropArrowdownId} setAttachmentUrlForDeletion={setAttachmentUrlForDeletion}/>
        }

        {
            clearChatPopupOpen && 
            <ClearChatPopup setClearChatPopupOpen={setClearChatPopupOpen} setDropdownOpen={setDropdownOpen} handleClearChat={handleClearChat} getAllMessagesBwtwo={getAllMessagesBwtwo}/>
        }

        {
            editPopupOpen && 
           <EditPopup messagesToDeleteText={messagesToDeleteText} messagesToDeleteTime={messagesToDeleteTime} setEditedText={setEditedText} handleEdit={handleEdit} setDropArrowdownId={setDropArrowdownId} editedText={editedText} setEditPopupOpen={setEditPopupOpen}/>
        }
        {
            startAChat && 
            <StartAChat setStartAChat={setStartAChat} userSearchText={userSearchText} setUserSearchText={setUserSearchText} currentUserId={currentUserId} userSeleted={userSeleted} setUserSeletec={setUserSeletec} setUserSeletectedUsername={setUserSeletectedUsername} setUserSeletectedPfp={setUserSeletectedPfp} getAllConversationsInFr={getAllConversationsInFr}/>
        }


        <div className='flex w-full h-screen'>
            
            <LeftMostBar setLogoutPopupOpen={setLogoutPopupOpen}/>

            <div className='w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center'>
                <div className='w-[90%] mt-5'>
                    <NexChatIcon/>

                    {/* //users list */}
                    <ConversationListBar users={users} conversations={conversations} userSeleted={userSeleted} setUserSeletec={setUserSeletec} setUserSeletectedUsername={setUserSeletectedUsername} setUserSeletectedPfp={setUserSeletectedPfp} onlineUsers={onlineUsers} setStartAChat={setStartAChat} currentUserId={currentUserId} setConversationId={setConversationId}/>
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

                                    console.log(message)

                                    return <OneMessage key={message._id} message={message} dropdownref={dropdownref} dropArrowdownId={dropArrowdownId} setDropArrowdownId={setDropArrowdownId} setAttachmentUrlForDeletion={setAttachmentUrlForDeletion} setDeletePopupOpen={setDeletePopupOpen} currentUserId={currentUserId} setMessageToDelete={setMessageToDelete} setEditPopupOpen={setEditPopupOpen} setMessageToDeleteTime={setMessageToDeleteTime} setMessageToDeleteText={setMessageToDeleteText}/>

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
import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, Search, Send, Plus, UsersRound } from "lucide-react";
import {ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon,TrashIcon   } from "@phosphor-icons/react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import socket from '../socket/socket';
import SelectedConversation from '../Components/SelectedConversation';
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
import CreateGroupPopup from '../Components/Popups/CreateGroupPopup';
import SelectUsersForGroupPopup from '../Components/Popups/SelectUsersForGroupPopup';

function HomePage() {

    let token = localStorage.getItem('token')
    let navigate = useNavigate()
    let scrollRef = useRef(null)
    let dropdownref = useRef(null)


    let [users, setUsers] = useState([]);
    let [conversations, setConversations] = useState([]);
    let [conversationSelected, setConversationSelected] = useState(null)
    let [conversationSelectedUsername, setConversationSelectedtedUsername] = useState(false)
    let [conversationSelectedPfp, setConversationSelectedtedPfp] = useState(null)
    let [currentUserId, setUserId] = useState(null)

    let [allMessagesBwTwo, setAllMessagesBwTwo] = useState([])
    let [onlineUsers, setOnlineUsers] = useState([])

    //popups state
    let [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    let [deletePopupOpen, setDeletePopupOpen] = useState(false);
    let [clearChatPopupOpen, setClearChatPopupOpen] = useState(false);
    let [editPopupOpen, setEditPopupOpen] = useState(false);
    let [startAChat, setStartAChat] = useState(false)
    let [createGroupPopupOpen, setCreateGroupPopupOpen] = useState(false)
    let [selectUsersForGroupPopupOpen, setSelectUsersForGroupPopupOpen] = useState(false)


    //flowbit dropdowns
    let [dropdownOpen, setDropdownOpen] = useState(false);
    let [dropdownNextToNexChatIcon, setDropdownNextToNextChatIcon] = useState(false)
    //arrow button for flowbite dropdown on each message (same state for all but open and close on the basis of id of message)
    let [dropArrowdownId, setDropArrowdownId] = useState(null);
    //this was on the basis of true and flase but cant use it as there are multiple such arrow buttons
    // let [dropArrowdownOpen, setDropArrowdownOpen] = useState(false);


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


    //group realted info
    let [groupName, setGroupName] = useState("")
    let [groupDescription, setGroupDescription] = useState("")
    let [isconversationAGroup, setIsConversationAGroup] = useState(false)
    let [groupMembers, setGroupMembers] = useState()
    let [groupAdmins, setGroupAdmins] = useState()

    //side bar
    let [isSideBarOpen, setIsSideBarOpen] = useState(false)

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

            setConversations((prev)=>{
                return prev.map((oneConversation,index)=>{
                    if(oneConversation._id == conversationId){
                        return{
                            ...oneConversation,
                            lastMessageSent:text,
                            lastTimeMessageSent:new Date(),
                            lastMessageSentBy: currentUserId
                        }
                    }else{
                        return oneConversation
                    }
                })
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
            let clearChatReq = await axios.post(`http://localhost:5000/api/messages/clearchat/${conversationId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getAllMessagesBwtwo()
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
            recieverId: conversationSelected,
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
        if(conversationId && currentUserId){
            getAllMessagesBwtwo()
        }
    }, [conversationSelected, currentUserId, conversationId])

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
            <StartAChat setStartAChat={setStartAChat} userSearchText={userSearchText} setUserSearchText={setUserSearchText} currentUserId={currentUserId} conversationSelected={conversationSelected} setConversationSelected={setConversationSelected} setConversationSelectedtedUsername={setConversationSelectedtedUsername} setConversationSelectedtedPfp={setConversationSelectedtedPfp} getAllConversationsInFr={getAllConversationsInFr} setConversationId={setConversationId} getAllMessagesBwtwo={getAllMessagesBwtwo}/>
        }
        {
            createGroupPopupOpen && 
            <CreateGroupPopup setSelectUsersForGroupPopupOpen={setSelectUsersForGroupPopupOpen} setCreateGroupPopupOpen={setCreateGroupPopupOpen} groupName={groupName} setGroupName={setGroupName}setGroupDescription={setGroupDescription} groupDescription={groupDescription}/>
        }

        {
            selectUsersForGroupPopupOpen &&
            <SelectUsersForGroupPopup setSelectUsersForGroupPopupOpen={setSelectUsersForGroupPopupOpen} groupName={groupName} setGroupName={setGroupName}setGroupDescription={setGroupDescription} groupDescription={groupDescription} currentUserId={currentUserId}/>
        }


        <div className='flex w-full h-screen'>
            
            <LeftMostBar setLogoutPopupOpen={setLogoutPopupOpen} setCreateGroupPopupOpen={setCreateGroupPopupOpen}/>

            <div className='w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center'>
                <div className='w-[90%] mt-5'>
                    <div className='flex justify-between w-[100%]'>
                        <NexChatIcon/>
                        {/* <div className='relative ml-auto mr-6'>
                            <button onClick={() => setDropdownNextToNextChatIcon(!dropdownNextToNexChatIcon)} className="text-white hover:bg-[#2b3142] rounded-md p-2 transition-all" type="button">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M12 6h.01M12 12h.01M12 18h.01"/></svg>
                            </button>
                            {
                                dropdownNextToNexChatIcon &&
                                <div className="absolute right-0 mt-2 bg-[#232a3a] border border-[#31384d] rounded-md shadow-lg w-40 z-50">
                                    <ul className="p-2 text-sm text-gray-300">
                                        <button className="inline-flex items-center w-full gap-4 p-2 hover:bg-[#2b3142] hover:text-white rounded-md transition-all">New Group<UsersRound size={20}/></button>
                                        {/* <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded-md transition-all" onClick={(e)=>{
                                            setClearChatPopupOpen(true)
                                        }}>Clear Chat</button> */}
                                    {/* </ul> */}
                                {/* </div> */}
                            {/* } */}
                        {/* </div> */}
                    </div>

                    {/* //users list */}
                    <ConversationListBar users={users} conversations={conversations} conversationSelected={conversationSelected} setConversationSelected={setConversationSelected} setConversationSelectedtedUsername={setConversationSelectedtedUsername} setConversationSelectedtedPfp={setConversationSelectedtedPfp} onlineUsers={onlineUsers} setStartAChat={setStartAChat} currentUserId={currentUserId} setConversationId={setConversationId} setIsConversationAGroup={setIsConversationAGroup} setGroupAdmins={setGroupAdmins} setGroupMembers={setGroupMembers}/>
                </div>
            </div>

            <div className='w-[71vw] bg-[#141720] min-h-[100vh]'>
                {
                    !conversationSelected && <div>
                    </div>
                }
                {
                    conversationSelected && <div className=''>
                        
                        <SelectedConversation conversationSelectedPfp={conversationSelectedPfp} conversationSelectedUsername={conversationSelectedUsername} dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} onlineUsers={onlineUsers} conversationSelected={conversationSelected} setClearChatPopupOpen={setClearChatPopupOpen} isconversationAGroup={isconversationAGroup} groupMembers={groupMembers} setIsSideBarOpen={setIsSideBarOpen}/>

                        <div className='h-[80vh] w-full overflow-y-auto'>
                            <div className='w-full py-6 pb-6'>
                                {
                                    allMessagesBwTwo.map((message, index)=>{
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


            <div className={`w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center ${isSideBarOpen ? "translate-x-0" : "translate-x-full"} duration-500 top-0 right-0 fixed`}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia porro veniam mollitia pariatur aut nisi, ad dolorem delectus animi minus consectetur velit rerum molestias similique obcaecati iure nemo ex reiciendis odit quidem magnam? Iure, atque. Reprehenderit praesentium laudantium placeat quae quasi harum ab reiciendis delectus itaque est iusto quos aperiam, et officia a autem nostrum eius ex officiis sequi natus laborum doloremque. Non impedit aliquid accusantium neque, perspiciatis magni repellat provident eum quis laudantium, eaque, consequuntur sint asperiores voluptatibus. Itaque iusto facilis excepturi doloribus corrupti, et consectetur impedit pariatur explicabo magnam ut neque exercitationem necessitatibus, debitis inventore laudantium quod hic assumenda ullam. Quam doloribus molestias, aliquid amet tenetur cumque omnis aperiam autem minus itaque! Quis quibusdam sunt quam voluptas, rem, quisquam reiciendis delectus cum totam temporibus tempora accusantium atque similique omnis, recusandae quaerat? Fuga ipsum laborum laboriosam eaque? Earum sed quasi reiciendis explicabo dicta voluptatibus cumque magni. Similique cupiditate nihil doloremque, tempora at labore sunt earum aut tempore officiis velit molestias omnis nesciunt dolore cum consectetur, pariatur voluptates vel eum autem, architecto sit quasi! Nihil eveniet hic dolorem magni odit in deleniti, quas commodi. Nobis fuga, in repudiandae quae sunt aliquid molestias reprehenderit ut, nam, ratione minima! Reiciendis, fuga nemo.
            </div>


        </div>
    </div>
  )
}

export default HomePage
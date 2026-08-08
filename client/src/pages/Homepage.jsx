import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import toast from "react-hot-toast";

import { MessageCircle, Search, Send, Plus, UsersRound, X } from "lucide-react";
import { ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon, TrashIcon } from "@phosphor-icons/react"
import socket from '../socket/socket.js';
import api from '../api/apiInstance.js'

//componets
import SelectedConversation from '../Components/SelectedConversation.jsx';
import ConversationListBar from '../Components/ConversationListBar.jsx';
import InputArea from '../Components/InputArea.jsx';
import NexChatIcon from '../Components/NexChatIcon.jsx';
import LeftMostBar from '../Components/LeftMostBar.jsx';
import OneMessage from '../Components/OneMessage.jsx';
import LogoutPopup from '../Components/Popups/LogoutPopup.jsx';
import DeletePopup from '../Components/Popups/DeletePopup.jsx';
import ClearChatPopup from '../Components/Popups/ClearChatPopup.jsx';
import EditPopup from '../Components/Popups/EditPopup.jsx';
import StartAChat from '../Components/Popups/StartAChat.jsx';
import CreateGroupPopup from '../Components/Popups/CreateGroupPopup.jsx';
import SelectUsersForGroupPopup from '../Components/Popups/SelectUsersForGroupPopup.jsx';
import SideOverlay from '../Components/SideOverlay.jsx';
import ImagePreview from '../Components/Popups/ImagePreview.jsx';
import DeleteForMePopup from '../Components/Popups/DeleteForMePopup.jsx';

//context
import { ConversationContext } from '../context/conversationContext.jsx';
import { UserContext } from '../context/userContext.jsx';
import { GroupContext } from '../context/groupContext.jsx';
import { getMessagesByConversationId, sendMessageService } from '../Services/messagesServices.js';

//utils
import { formatDayLabel } from '../utils/formatDays.js'
import UserProfilePopup from '../Components/Popups/UserProfilePopup.jsx';
import EditProfilePopup from '../Components/Popups/EditProfilePopup.jsx';
import LoadingSpin from '../Components/LoadingSpin.jsx';
import LoadingPage from './LoadingPage.jsx';

function HomePage() {

    let token = localStorage.getItem('token')
    let navigate = useNavigate()
    let scrollRef = useRef(null)
    let dropdownref = useRef(null)

    let [users, setUsers] = useState([]);

    let {
        conversations,
        conversationId,
        setConversationId,
        isconversationAGroup,
        setIsConversationAGroup,
        setConversations,
        conversationSelected,
        setConversationSelected,
        conversationSelectedUsername,
        setConversationSelectedtedUsername,
        conversationSelectedDescription,
        setConversationSelectedDescription,
        conversationSelectedPfp,
        setConversationSelectedtedPfp
    } = useContext(ConversationContext);

    let [loading, setLoading] = useState({messages:false, conversation:false})

    let{
        currentUserId, setUserId,userLoading
    } = useContext(UserContext)



    let {
        groupName, setGroupName,
        groupDescription, setGroupDescription,
        setGroupMembers, groupMembers,
        groupAdmins, setGroupAdmins
    } = useContext(GroupContext)



    let [allMessagesBwTwo, setAllMessagesBwTwo] = useState([])
    let [onlineUsers, setOnlineUsers] = useState([])

    let [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    let [deletePopupOpen, setDeletePopupOpen] = useState(false);
    let [clearChatPopupOpen, setClearChatPopupOpen] = useState(false);
    let [editPopupOpen, setEditPopupOpen] = useState(false);
    let [startAChat, setStartAChat] = useState(false)
    let [createGroupPopupOpen, setCreateGroupPopupOpen] = useState(false)
    let [selectUsersForGroupPopupOpen, setSelectUsersForGroupPopupOpen] = useState(false)
    let [userProfilePopupOpen, setUserProfilePopupOpen] = useState(false)
    let [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false)
    let [deleteForMePopupOpen,setDeleteForMePopupOpen] = useState(false)

    let [dropdownOpen, setDropdownOpen] = useState(false);
    let [dropdownNextToNexChatIcon, setDropdownNextToNextChatIcon] = useState(false)
    let [dropArrowdownId, setDropArrowdownId] = useState(null);

    let [messageToDelete, setMessageToDelete] = useState(null);
    let [attachmentUrlForDeletion, setAttachmentUrlForDeletion] = useState("")

    let [text, setText] = useState("")
    let [attachments, setAttachments] = useState([])

    let [messagesToDeleteText, setMessageToDeleteText] = useState("")
    let [messagesToDeleteTime, setMessageToDeleteTime] = useState()
    let [editedText, setEditedText] = useState("")

    let [userSearchText, setUserSearchText] = useState("")
    let [conversationSearch, setConversationSearch] = useState("")



    let [isSideBarOpen, setIsSideBarOpen] = useState(false)
    let [userSelectedIdIfNotGroup, setUserSelectedIdIfNotGroup] = useState(null)

    let sideOverlayRef = useRef(null)

    const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
    const [previewSrc, setPreviewSrc] = useState("")
    let [imageBlobs, setImageBlobs] = useState([])

    //left side bar
    const [activeLeftBar, setActiveLeftBar] = useState("chats")

    //date tag
    let last = null
    let curr = null
    

    // ---------------- API CALLS ----------------

    
    let getAllConversationsInFr = async () => {
        try {
            setLoading((prev)=>{
                return {...prev, conversation:true}
            })
            let res = await api.get('/conversations/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setConversations(res.data)
        } catch (err) {
            console.log(err)
        }finally{
            setLoading((prev)=>{
                return {...prev, conversation:false}
            })
        }
    }
    
    let getAllMessagesBwtwo = async () => {
        try{
            setLoading((prev)=>{
                return {...prev, messages:true}
            })
            let data = await getMessagesByConversationId(conversationId)
            setAllMessagesBwTwo(data)
        }catch(err){
            console.log("error getting messages between two users ",err);
        }finally{
            setLoading((prev)=>{
                return {...prev, messages:false}
            })
        }
    }

    let sendMessageFunc = async () => {
        try {
            let res = await sendMessageService({
                text,
                senderId: currentUserId,
                conversationId,
                attachments
            })

            setAllMessagesBwTwo(prev => [...prev, res.data])

            setConversations(prev =>
            prev.map(c =>
                    c._id === conversationId
                        ? {
                            ...c,
                            lastMessageSent: res.data,
                            lastTimeMessageSent:new Date(),
                            lastMessageSentBy:currentUserId
                        }
                        : c
                )
            )

            setText("")
            setAttachments([])
            setImageBlobs([])


            getAllConversationsInFr();
        } catch(err) {
            console.log(err)
        }
    }

let handleDelete = async () => {
    try {
        let typeOf = attachmentUrlForDeletion ? "attachment" : "text"

        let res = await api.delete('/messages/delete', {
            data:{
                typeOf,
                messageToDelete,
                attachmentUrlForDeletion
            },
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        let deletedMessage = res.data

        // update messages in chat window
        setAllMessagesBwTwo(prev =>
            prev.map(m =>
                m._id === messageToDelete
                ? deletedMessage
                : m
            )
        )


        // update conversation last message
        setConversations(prev =>
            prev.map(c => {

                if(c._id !== conversationId){
                    return c
                }

                return {
                    ...c,
                    lastMessageSent: deletedMessage,
                    lastTimeMessageSent: new Date(),
                    lastMessageSentBy: deletedMessage.senderId
                }
            })
        )


        setDeletePopupOpen(false)
        setDropArrowdownId(null)
        setAttachmentUrlForDeletion("")

    } catch(err){
        console.log(err)
    }
}

   let handleDeleteForMe = async()=>{
        try{

            let res = await api.delete(
                "/messages/deleteforme",
                {
                    data:{
                        messageToDelete: messageToDelete
                    },
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )


            // hide from current user only
            setAllMessagesBwTwo(prev =>
                prev.filter(
                    message => message._id !== messageToDelete
                )
            )


            setDeleteForMePopupOpen(false)
            setDropArrowdownId(null)
            setMessageToDelete(null)

        }catch(err){
            console.log(err)
        }
    }

    let handleEdit = async () => {
        try {
            await api.post('/messages/edit', {
                messageId: dropArrowdownId,
                editedText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            let newArrAfterEditing = allMessagesBwTwo.map((m,idx)=>{
                if(m._id!=dropArrowdownId){
                    return m
                }

                m={...m, text:editedText}
                return m;
            })

            setAllMessagesBwTwo(newArrAfterEditing)

            setEditPopupOpen(false)
            setDropArrowdownId(null)

            
        } catch (err) {
            console.log(err)
        }
    }

    let handleClearChat = async () => {
        try {

            if(allMessagesBwTwo.length==0){
                toast("No Messages", {
                    style: { background: '#3b82f6', color: '#fff' }
                })

                return;
            }


            await api.post(`/messages/clearchat/${conversationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAllMessagesBwTwo([])

            toast("Cleared Chat", {
                style: { background: '#3b82f6', color: '#fff' }
            })
        } catch (err) {
            console.log(err)
        }
    }

    let handleMedia = async (e) => {
        let files = Array.from(e.target.files)
        if(files.length > 5){
            toast("Can't Send More Than 5 Images At Once!", {
                style: { background: '#3b82f6', color: '#fff' }
            })
            return;
        }

        for(let file of files){
            if(!file.type.includes("image")){
                toast("Can't Send Files Other Than Images!", {
                    style: { background: '#3b82f6', color: '#fff' }
                })
                return;
            }
        }

        for(let file of files){
            let newBlobUrl = URL.createObjectURL(file);
            setImageBlobs((prev)=>{
                return [...prev, newBlobUrl]
            })
        }

        let uploadFile = async (file) => {
            let data = new FormData()
            data.append("file", file)
            data.append("upload_preset", "NexChatUploadPreset")
            data.append("cloud_name", "dgv5nxqxx")

            let url =
                file.type.includes("image")
                    ? "https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload"
                    : "https://api.cloudinary.com/v1_1/dgv5nxqxx/video/upload"

            let res = await fetch(url, { method: "POST", body: data })
            let json = await res.json()

            return {
                url: json.secure_url || json.url,
                type: file.type.includes("image") ? "image" : "video",
                isDeletedForEveryone: false
            }
        }

        let uploaded = await Promise.all(files.map(uploadFile))

        setAttachments(uploaded)
    }

    let handleLogout = async () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    // ---------------- EFFECTS ----------------

    useEffect(() => {
        if(currentUserId){
            getAllConversationsInFr()
        }
    }, [currentUserId])


    useEffect(() => {
        if (conversationId && currentUserId) {
            getAllMessagesBwtwo()
        }
    }, [conversationId, currentUserId])


    useEffect(() =>{
        if(scrollRef.current){
            scrollRef.current.scrollTop =
            scrollRef.current.scrollHeight;
        }
    }, [allMessagesBwTwo])


    useEffect(() => {

        if(!currentUserId) return;

        socket.connect()
        socket.on("connect", () => {
            // console.log(currentUserId)
            socket.emit("join", currentUserId)
        })

        socket.on("recieve_message",(msg)=>{
            if(msg.senderId != currentUserId){
                // console.log(currentUserId)
                // console.log(msg)
                // console.log(String(msg.conversationId) == String(conversationId))
                // console.log(msg.conversationId)
                // console.log(conversationSelected)
                // currently opened chat
                if(msg.conversationId === conversationId){

                    setAllMessagesBwTwo(prev=>[
                        ...prev,
                        msg
                    ])

                }
                // update conversation sidebar always
                setConversations(prev =>
                    prev.map(c =>
                        c._id === msg.conversationId
                        ? {
                            ...c,
                            lastMessageSent: msg,
                            lastTimeMessageSent: new Date(),
                            lastMessageSentBy: msg.senderId
                        }
                        : c
                    )
                )
            }
        })


        socket.on("online_users", (users)=>{
            setOnlineUsers(users)
        })

        socket.on("messages_seen",(data)=>{
            const {conversationId, userId}=data;

            setAllMessagesBwTwo(prev => {

                let newarr = prev.map(message => ({
                    ...message,
                    seenBy:[
                        ...(message.seenBy || []),
                        userId
                    ]
                }))

                // console.log("before", prev)
                // console.log("after", newarr)

                return newarr
            })
        })

        socket.on("message_deleted",(deletedMessage)=>{
            setAllMessagesBwTwo(prev =>
                prev.map(message =>
                    message._id === deletedMessage._id
                    ? deletedMessage
                    : message
                )
            );
        });

        socket.on("message_edited",(editedMessage)=>{
            setAllMessagesBwTwo(prev =>
                prev.map(message =>
                    message._id === editedMessage._id
                    ? {
                        ...message,
                        ...editedMessage
                    }
                    : message
                )
            )
        })

        return () => {
            socket.off("connect")
            socket.off("recieve_message")
        }

    }, [currentUserId, conversationSelected, conversationId])

    // useEffect(() => {
    //     let handleClick = (e) => {
    //         if (isSideBarOpen && !sideOverlayRef.current.contains(e.target)) {
    //             setIsSideBarOpen(false)
    //         }
    //     }

    //     document.addEventListener("mousedown", handleClick)
    //     return () => document.removeEventListener("mousedown", handleClick)
    // }, [isSideBarOpen])


    if(userLoading){
        return <LoadingPage/>
    }


    return (
        <div>

            {
                logoutPopupOpen && 
                <LogoutPopup handleLogout={handleLogout} setLogoutPopupOpen={setLogoutPopupOpen}/>
            }

            {
                deletePopupOpen && 
                <DeletePopup 
                handleDelete={handleDelete} 
                setDeletePopupOpen={setDeletePopupOpen} setDropArrowdownId={setDropArrowdownId} setAttachmentUrlForDeletion={setAttachmentUrlForDeletion}/>
            }

            {
                deleteForMePopupOpen &&
                <DeleteForMePopup
                    handleDeleteForMe={handleDeleteForMe}
                    messageToDelete={messageToDelete}
                    setDeleteForMePopupOpen={setDeleteForMePopupOpen}
                    setDropArrowdownId={setDropArrowdownId}
                />
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
                <StartAChat 
                setStartAChat={setStartAChat}
                userSearchText={userSearchText} 
                setUserSearchText={setUserSearchText} 
                getAllConversationsInFr={getAllConversationsInFr} 
                setConversationId={setConversationId} 
                getAllMessagesBwtwo={getAllMessagesBwtwo}/>
            }
            {
                createGroupPopupOpen && 
                <CreateGroupPopup 
                setSelectUsersForGroupPopupOpen={setSelectUsersForGroupPopupOpen}
                setCreateGroupPopupOpen={setCreateGroupPopupOpen}
                setActive={setActiveLeftBar}
                />
            }
            {
                selectUsersForGroupPopupOpen &&
                <SelectUsersForGroupPopup 

                setSelectUsersForGroupPopupOpen={setSelectUsersForGroupPopupOpen} 
                groupName={groupName} 
                setGroupName={setGroupName}
                setGroupDescription={setGroupDescription} 
                groupDescription={groupDescription} 
                currentUserId={currentUserId}
                getAllConversationsInFr={getAllConversationsInFr}
                setCreateGroupPopupOpen={setCreateGroupPopupOpen}
                />
            }
            {
                editPopupOpen &&
                <EditPopup 
                    setEditPopupOpen={setEditPopupOpen}
                    messagesToDeleteText={messagesToDeleteText}
                    messagesToDeleteTime={messagesToDeleteTime}
                    setEditedText={setEditedText}
                    handleEdit={handleEdit}
                    setDropArrowdownId={setDropArrowdownId}
                    editedText={editedText}/>
            }

            {imagePreviewOpen && (
                <ImagePreview
                    src={previewSrc}
                    setImagePreviewOpen={setImagePreviewOpen}
                />
            )}

            {
                userProfilePopupOpen && 
                <UserProfilePopup
                    setUserProfilePopupOpen={setUserProfilePopupOpen}
                    setEditProfilePopupOpen={setEditProfilePopupOpen}
                    setActive={setActiveLeftBar}
                />
            }


            {
                editProfilePopupOpen && 
                <EditProfilePopup
                    setEditProfilePopupOpen={setEditProfilePopupOpen}
                    editProfilePopupOpen={editProfilePopupOpen}
                    setActive={setActiveLeftBar}
                />
            }


            <div className="flex w-full h-screen overflow-hidden bg-[#141720]">
                {/* LEFT ICON BAR (hidden on mobile) */}
                <div className="hidden md:block">
                    <LeftMostBar
                        setLogoutPopupOpen={setLogoutPopupOpen}
                        setCreateGroupPopupOpen={setCreateGroupPopupOpen}
                        setUserProfilePopupOpen={setUserProfilePopupOpen}
                        active={activeLeftBar}
                        setActive={setActiveLeftBar}
                    />
                </div>

                <div className={`bg-[#212634] h-screen overflow-hidden flex flex-col items-center w-full md:w-[25vw] border-r border-[#1d2230] ${conversationSelected ? "hidden md:flex" : "flex"}`}>
                    <div className="w-[90%] mt-5 flex-shrink-0">
                        <NexChatIcon />
                        <div className='w-full bg-[#141720] border border-[#2a3040] focus-within:border-[#4c7dff]/50 h-11 rounded-lg flex items-center gap-2.5 mb-3 px-3.5 transition-colors duration-150'>
                            <Search className='text-gray-500' size={17} />

                            <input
                                type="text"
                                value={conversationSearch}
                                onChange={(e) => setConversationSearch(e.target.value)}
                                placeholder='Search chats'
                                className='w-full outline-none bg-transparent text-white h-full text-[14px] placeholder:text-gray-500'
                            />

                            {conversationSearch && (
                                <button
                                    onClick={() => setConversationSearch("")}
                                    className="text-gray-500 hover:text-white transition-colors duration-150 flex-shrink-0"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-[90%] flex-1 overflow-hidden mb-3">
                        <ConversationListBar
                            users={users}
                            onlineUsers={onlineUsers}
                            setStartAChat={setStartAChat}
                            setUserSelectedIdIfNotGroup={setUserSelectedIdIfNotGroup}
                            setAllMessagesBwTwo = {setAllMessagesBwTwo}
                            setIsSideBarOpen={setIsSideBarOpen}
                            conversationSearch={conversationSearch}
                            loading={loading}
                        />
                    </div>
                </div>

                <div className={`flex-1 bg-[#141720] flex flex-col h-screen overflow-hidden ${!conversationSelected ? 'hidden md:flex' : 'flex'}`}>
                    {conversationSelected && (
                        <>
                            <div className="flex-shrink-0">
                                <SelectedConversation
                                    dropdownOpen={dropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                    onlineUsers={onlineUsers}
                                    setClearChatPopupOpen={setClearChatPopupOpen}
                                    setIsSideBarOpen={setIsSideBarOpen}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                                <div className="w-full py-6 pb-6 h-full">
                                    {
                                        loading.messages && (
                                            <div className="flex flex-col justify-center items-center h-full gap-3">
                                                <div className="w-9 h-9 border-[3px] border-[#2a3142] border-t-[#4c7dff] rounded-full animate-spin"></div>
                                                <p className="text-[13px] text-gray-400">
                                                    Loading messages...
                                                </p>
                                            </div>
                                        )
                                    }

                                    {
                                        !loading.messages && allMessagesBwTwo.length === 0 && (
                                            <div className="flex flex-col justify-center items-center h-full gap-3 text-center px-5">

                                                <div className="w-16 h-16 rounded-full bg-[#1d2235] flex items-center justify-center ring-1 ring-[#2a3142]">
                                                    <svg
                                                        className="w-7 h-7 text-gray-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.82L3 20l1.32-3.3A7.63 7.63 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                        />
                                                    </svg>
                                                </div>

                                                <p className="text-gray-200 font-medium text-[14.5px]">
                                                    No messages yet
                                                </p>

                                                <p className="text-[13px] text-gray-500 max-w-[250px]">
                                                    Start the conversation and send your first message
                                                </p>

                                            </div>
                                        )
                                    }
                                    {
                                        loading.messages == false &&
                                        allMessagesBwTwo.map((message) => {
                                            curr = formatDayLabel(message.createdAt)
                                            let show = last != curr
                                            last = curr

                                            return (
                                                <div key={message._id}>
                                                    {show && (
                                                        <div className="flex justify-center my-4">
                                                            <span className="bg-[#1d2235] text-gray-400 px-3 py-1 rounded-full text-[11.5px] font-medium border border-[#2a3142]">
                                                                {curr}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <OneMessage
                                                        scrollRef={scrollRef}
                                                        message={message}
                                                        dropdownref={dropdownref}
                                                        dropArrowdownId={dropArrowdownId}
                                                        setDropArrowdownId={setDropArrowdownId}
                                                        setAttachmentUrlForDeletion={setAttachmentUrlForDeletion}
                                                        setDeletePopupOpen={setDeletePopupOpen}
                                                        setMessageToDelete={setMessageToDelete}
                                                        setEditPopupOpen={setEditPopupOpen}
                                                        setMessageToDeleteTime={setMessageToDeleteTime}
                                                        setMessageToDeleteText={setMessageToDeleteText}
                                                        setImagePreviewOpen={setImagePreviewOpen}
                                                        setPreviewSrc={setPreviewSrc}
                                                        setDeleteForMePopupOpen={setDeleteForMePopupOpen}
                                                        />
                                                        
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {imageBlobs.length > 0 && (
                                <div className="flex-shrink-0 px-4 py-3 bg-[#1a1f2e] border-t border-[#2a3142]">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {imageBlobs.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-[#2a3142] bg-[#141720]">

                                            <img  src={src} alt="preview" className="w-full h-full object-cover"/>
                                            <button className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 text-white text-[11px] w-4.5 h-4.5 rounded-full flex items-center justify-center transition-colors duration-150"
                                            onClick={() =>{
                                                setImageBlobs(prev => prev.filter((_, i) => i !== index))
                                                setAttachments(prev => prev.filter((_, i) => i !== index))
                                            }
                                            }>×</button>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex-shrink-0">
                                <InputArea
                                    text={text}
                                    setText={setText}
                                    sendMessageFunc={sendMessageFunc}
                                    handleMedia={handleMedia}
                                    imageBlobs={imageBlobs}
                                    setImageBlobs={setImageBlobs}
                                />
                            </div>
                        </>
                    )}
                </div>


                <div className={`${conversationSelected ? "w-[25vw]":""} bg-[#212634] min-h-[100vh] flex flex-col items-center border-l border-[#1d2230]`} ref={sideOverlayRef}>
                    {
                        conversationSelected && 
                        <SideOverlay 
                        setUserSelectedIdIfNotGroup={setUserSelectedIdIfNotGroup}
                        setIsSideBarOpen={setIsSideBarOpen} 
                        userA={userSelectedIdIfNotGroup} 
                        userB={currentUserId}
                        onlineUsers={onlineUsers}
                        setClearChatPopupOpen={setClearChatPopupOpen}
                        onClearChat={handleClearChat}
                        />
                    }
                </div>
            </div>

        </div>
    )
}

export default HomePage
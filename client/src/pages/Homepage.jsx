import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import toast from "react-hot-toast";

import { MessageCircle, Search, Send, Plus, UsersRound } from "lucide-react";
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

//context
import { ConversationContext } from '../context/conversationContext.jsx';
import { UserContext } from '../context/userContext.jsx';
import { GroupContext } from '../context/groupContext.jsx';
import { getMessagesByConversationId, sendMessageService } from '../Services/messagesServices.js';

//utils
import { formatDayLabel } from '../utils/formatDays.js'
import UserProfilePopup from '../Components/Popups/UserProfilePopup.jsx';
import EditProfilePopup from '../Components/Popups/EditProfilePopup.jsx';

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

    let{
        currentUserId, setUserId
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



    let [isSideBarOpen, setIsSideBarOpen] = useState(false)
    let [userSelectedIdIfNotGroup, setUserSelectedIdIfNotGroup] = useState(null)

    let sideOverlayRef = useRef(null)

    const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
    const [previewSrc, setPreviewSrc] = useState("")
    let [imageBlobs, setImageBlobs] = useState([])

    //date tag
    let last = null
    let curr = null
    

    // ---------------- API CALLS ----------------

    
    let getAllConversationsInFr = async () => {
        try {
            let res = await api.get('/conversations/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setConversations(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    
    let getAllMessagesBwtwo = async () => {
        try{
            let data = await getMessagesByConversationId(conversationId)
            setAllMessagesBwTwo(data)
        }catch(err){
            console.log("error getting messages between two users ",err);
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
                            lastMessageSent: text ? text : `Images${attachments.length}`,
                            lastTimeMessageSent: new Date(),
                            lastMessageSentBy: currentUserId
                        }
                        : c
                )
            )

            getAllConversationsInFr()
            setText("")
            setAttachments([])
            setImageBlobs([])
        } catch(err) {
            console.log(err)
        }
    }

    let handleDelete = async () => {
        try {
            let typeOf = attachmentUrlForDeletion ? "attachment" : "text"

            await api.delete('/messages/delete', {
                data: {
                    typeOf,
                    messageToDelete,
                    attachmentUrlForDeletion
                },
                headers: { Authorization: `Bearer ${token}` }
            })

            getAllMessagesBwtwo()
        } catch (err) {
            console.log(err)
        }
    }

    // let handleDeleteForMe = async () => {
    //     try {
    //         let typeOf = attachmentUrlForDeletion ? "attachment" : "text"

    //         await api.delete('/messages/delete', {
    //             data: {
    //                 typeOf,
    //                 messageToDelete,
    //                 attachmentUrlForDeletion
    //             },
    //             headers: { Authorization: `Bearer ${token}` }
    //         })

    //         getAllMessagesBwtwo()
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    let handleEdit = async () => {
        try {
            await api.post('/messages/edit', {
                messageId: dropArrowdownId,
                editedText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            getAllMessagesBwtwo()
            setEditPopupOpen(false)
            setDropArrowdownId(null)
        } catch (err) {
            console.log(err)
        }
    }



    let handleClearChat = async () => {
        try {
            await api.post(`/messages/clearchat/${conversationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            getAllMessagesBwtwo()

            toast("Cleared Chat", {
                style: { background: '#3b82f6', color: '#fff' }
            })
        } catch (err) {
            console.log(err)
        }
    }

    let handleMedia = async (e) => {
        console.log("hmmm")
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
        console.log(uploaded)

        setAttachments(uploaded)

        // let res = await api.post('/messages/send', {
        //     text,
        //     senderId: currentUserId,
        //     conversationId,
        //     attachments: uploaded
        // }, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })

        // console.log("done sending")

        // setAllMessagesBwTwo(prev => [...prev, res.data])
        // setAttachments([])
        // setText("")
    }

    let handleLogout = async () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    

    // ---------------- EFFECTS ----------------

    useEffect(() => {
        getAllConversationsInFr()
    }, [])

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
        socket.connect()
        socket.on("connect", () => {
            socket.emit("join", currentUserId)
        })
        socket.on("recieve_message", (msg) => {
            setAllMessagesBwTwo(prev => [...prev, msg])
        })
        socket.on("online_users", setOnlineUsers)

        return () => {
            socket.off("connect")
            socket.off("recieve_message")
        }

    }, [currentUserId])

    // useEffect(() => {
    //     let handleClick = (e) => {
    //         if (isSideBarOpen && !sideOverlayRef.current.contains(e.target)) {
    //             setIsSideBarOpen(false)
    //         }
    //     }

    //     document.addEventListener("mousedown", handleClick)
    //     return () => document.removeEventListener("mousedown", handleClick)
    // }, [isSideBarOpen])


    return (
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
                <CreateGroupPopup setSelectUsersForGroupPopupOpen={setSelectUsersForGroupPopupOpen} setCreateGroupPopupOpen={setCreateGroupPopupOpen}/>
            }
            {
                editPopupOpen &&
                <EditPopup setEditPopupOpen={setEditPopupOpen}/>
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
                    setUserProfilePopupOpen={setUserProfilePopupOpen} setEditProfilePopupOpen={setEditProfilePopupOpen}/>
            }
            {
                editProfilePopupOpen && 
                    <EditProfilePopup
                    setEditProfilePopupOpen={setEditProfilePopupOpen} editProfilePopupOpen={editProfilePopupOpen}/>
            }


            <div className="flex w-full h-screen overflow-hidden">
                {/* LEFT ICON BAR (hidden on mobile) */}
                <div className="hidden md:block">
                    <LeftMostBar
                        setLogoutPopupOpen={setLogoutPopupOpen}
                        setCreateGroupPopupOpen={setCreateGroupPopupOpen}
                        setUserProfilePopupOpen={setUserProfilePopupOpen}
                    />
                </div>

                <div className={`bg-[#212634] h-screen overflow-hidden flex flex-col items-center w-full md:w-[25vw] ${conversationSelected ? "hidden md:flex" : "flex"}`}>
                    <div className="w-[90%] mt-5 flex-shrink-0">
                        <NexChatIcon />
                        <div className='w-full bg-[#141720] h-[7vh] rounded-md flex items-center gap-2 mb-2'>
                            <Search className='text-white ml-4' size={19} />
                            <input
                                type="text"
                                placeholder='Search Chats'
                                className='w-full outline-none bg-transparent text-white h-[8vh] text-md placeholder:text-gray-500'
                            />
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
                                <div className="w-full py-6 pb-6">
                                    {allMessagesBwTwo.map((message)=>{
                                        curr = (formatDayLabel(message.createdAt))
                                        let show = last != curr
                                        last = (curr);
                                        return <div key={message._id}>

                                         {show && (
                                            <div className="flex justify-center my-4">
                                                <span className="bg-[#2a3142] text-gray-300 px-3 py-1 rounded-full text-sm">
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
                                        />

                                        </div>
                                    })}
                                </div>
                            </div>

                            {imageBlobs.length > 0 && (
                                <div className="flex-shrink-0 px-4 py-3 bg-[#1a1f2e] border-t border-[#2a3142]">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {imageBlobs.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-[#2a3142] bg-[#141720]">

                                            <img  src={src} alt="preview" className="w-full h-full object-cover"/>
                                            <button className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full"
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


                <div className={`w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center`} ref={sideOverlayRef}>
                    {
                        isSideBarOpen && 
                        <SideOverlay 
                        setUserSelectedIdIfNotGroup={setUserSelectedIdIfNotGroup}
                        setIsSideBarOpen={setIsSideBarOpen} 
                        userA={userSelectedIdIfNotGroup} 
                        userB={currentUserId}
                        onlineUsers={onlineUsers}/>
                    }
                </div>
            </div>

        </div>
    )
}

export default HomePage
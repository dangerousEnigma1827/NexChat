import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, Search, Send, Plus, UsersRound } from "lucide-react";
import { ChatsCircleIcon, ChatCircleTextIcon, SignOutIcon, TrashIcon } from "@phosphor-icons/react"
import { useNavigate } from 'react-router-dom'
import socket from '../socket/socket';
import api from '../api/apiInstance.js'

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
import SideOverlay from '../Components/SideOverlay';

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

    // popups
    let [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
    let [deletePopupOpen, setDeletePopupOpen] = useState(false);
    let [clearChatPopupOpen, setClearChatPopupOpen] = useState(false);
    let [editPopupOpen, setEditPopupOpen] = useState(false);
    let [startAChat, setStartAChat] = useState(false)
    let [createGroupPopupOpen, setCreateGroupPopupOpen] = useState(false)
    let [selectUsersForGroupPopupOpen, setSelectUsersForGroupPopupOpen] = useState(false)

    let [dropdownOpen, setDropdownOpen] = useState(false);
    let [dropdownNextToNexChatIcon, setDropdownNextToNextChatIcon] = useState(false)
    let [dropArrowdownId, setDropArrowdownId] = useState(null);

    let [messageToDelete, setMessageToDelete] = useState(null);
    let [attachmentUrlForDeletion, setAttachmentUrlForDeletion] = useState("")

    let [messageType, setMessageText] = useState("text")
    let [text, setText] = useState("")
    let [attachments, setAttachments] = useState([])

    let [messagesToDeleteText, setMessageToDeleteText] = useState("")
    let [messagesToDeleteTime, setMessageToDeleteTime] = useState()
    let [editedText, setEditedText] = useState("")

    let [userSearchText, setUserSearchText] = useState("")
    let [conversationId, setConversationId] = useState(null)

    let [groupName, setGroupName] = useState("")
    let [groupDescription, setGroupDescription] = useState("")
    let [isconversationAGroup, setIsConversationAGroup] = useState(false)
    let [groupMembers, setGroupMembers] = useState()
    let [groupAdmins, setGroupAdmins] = useState()

    let [isSideBarOpen, setIsSideBarOpen] = useState(false)
    let [userSelectedIdIfNotGroup, setUserSelectedIdIfNotGroup] = useState(null)

    let sideOverlayRef = useRef(null)

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

    let getCurrentUser = async () => {
        try {
            let res = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUserId(res.data._id)
        } catch (err) {
            console.log(err)
        }
    }

    let getAllMessagesBwtwo = async () => {
        try {
            let res = await api.get(`/conversations/allMessagesOfAConversation/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAllMessagesBwTwo(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    let sendMessageFunc = async () => {
        try {
            let res = await api.post('/messages/send', {
                text,
                senderId: currentUserId,
                conversationId,
                attachments
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setAllMessagesBwTwo(prev => [...prev, res.data])

            setConversations(prev =>
                prev.map(c =>
                    c._id === conversationId
                        ? {
                            ...c,
                            lastMessageSent: text,
                            lastTimeMessageSent: new Date(),
                            lastMessageSentBy: currentUserId
                        }
                        : c
                )
            )

            setText("")
            setAttachments([])
        } catch (err) {
            console.log(err)
        }
    }

    let handleLogout = async () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    let handleClearChat = async () => {
        try {
            await api.post(`/messages/clearchat/${conversationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            getAllMessagesBwtwo()
        } catch (err) {
            console.log(err)
        }
    }

    let handleMedia = async (e) => {
        let files = Array.from(e.target.files)

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

        let res = await api.post('/messages/send', {
            text,
            senderId: currentUserId,
            recieverId: conversationSelected,
            attachments: uploaded
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        setAllMessagesBwTwo(prev => [...prev, res.data])
        setAttachments([])
        setText("")
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

    // ---------------- EFFECTS ----------------

    useEffect(() => {
        getCurrentUser()
        getAllConversationsInFr()
    }, [])

    useEffect(() => {
        if (conversationId && currentUserId) {
            getAllMessagesBwtwo()
        }
    }, [conversationId, currentUserId])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
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

    useEffect(() => {
        let handleClick = (e) => {
            if (isSideBarOpen && !sideOverlayRef.current.contains(e.target)) {
                setIsSideBarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [isSideBarOpen])

    // ---------------- UI (UNCHANGED) ----------------

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
                    </div>

                    {/* //users list */}
                    <ConversationListBar users={users} conversations={conversations} conversationSelected={conversationSelected} setConversationSelected={setConversationSelected} setConversationSelectedtedUsername={setConversationSelectedtedUsername} setConversationSelectedtedPfp={setConversationSelectedtedPfp} onlineUsers={onlineUsers} setStartAChat={setStartAChat} currentUserId={currentUserId} setConversationId={setConversationId} setIsConversationAGroup={setIsConversationAGroup} setGroupAdmins={setGroupAdmins} setGroupMembers={setGroupMembers} setUserSelectedIdIfNotGroup={setUserSelectedIdIfNotGroup}/>
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


            <div className={`w-[25vw] bg-[#212634] min-h-[100vh] flex  flex-col items-center duration-500 top-0 right-0 fixed ${!isSideBarOpen? "translate-x-full" : "translate-x-0"}`}  ref={sideOverlayRef}>
                <SideOverlay 
                setIsSideBarOpen={setIsSideBarOpen} 
                userA={userSelectedIdIfNotGroup} 
                userB={currentUserId} 
                conversationSelectedPfp={conversationSelectedPfp} 
                conversationSelectedUsername={conversationSelectedUsername} 
                onlineUsers={onlineUsers} 
                conversationSelected={conversationSelected} 
                isconversationAGroup={isconversationAGroup}
                groupMembers={groupMembers}
                groupAdmins={groupAdmins}
                groupDescription={groupDescription}
                />
            </div>

        </div>
    </div>
  )
}

export default HomePage


// SelectUsersForGroupPopup.jsx
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ArrowLeftIcon, Search, X, UsersIcon, Loader2 } from 'lucide-react'
import { UserContext } from '../../context/userContext'
import { GroupContext } from '../../context/groupContext'

function SelectUsersForGroupPopup({
    setSelectUsersForGroupPopupOpen,
    setCreateGroupPopupOpen,
    getAllConversationsInFr
}) {

    const token = localStorage.getItem('token')

    const { currentUserId } = useContext(UserContext)

    let {
        groupName, groupDescription,
        setGroupName, setGroupDescription
        } = useContext(GroupContext)

    const [allSingleUsers, setAllSingleUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const handleAllSingleUsers = async () => {
        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:5000/api/conversations/getAllSingleUsers',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setAllSingleUsers(res.data)

        } catch (err) {
            console.log("error getting all single users in frontend", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleAllSingleUsers()
    }, [])

    const filteredUsers = allSingleUsers.filter(user =>
        user.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    )

    const handleUserSelect = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(
                selectedUsers.filter(id => id !== userId)
            )
        } else {
            setSelectedUsers(prev => [
                ...prev,
                userId
            ])
        }
    }

    const handleCreateGroup = async () => {
        try {

            let finalarr = [
                ...selectedUsers,
                currentUserId
            ]

            await axios.post(
                'http://localhost:5000/api/conversations/createGroup',
                {
                    participants: finalarr,
                    groupName,
                    groupDescription
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            getAllConversationsInFr()
            setSelectUsersForGroupPopupOpen(false)

        } catch (err) {
            console.log("error creating group", err)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100000] px-4'>

            <div className='w-full max-w-[500px] sm:w-[500px] h-[560px] bg-[#1b2130] border border-[#2a3040] rounded-xl shadow-2xl p-5 flex flex-col'>

                {/* Header */}
                <div className='flex items-center justify-between mb-4'>

                    <div>
                        <h1 className='text-[17px] font-semibold text-white'>
                            Select Users
                        </h1>

                        <p className='text-[12.5px] text-gray-500 mt-0.5'>
                            Choose members for your group
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setSelectUsersForGroupPopupOpen(false)
                            setGroupDescription("")
                            setGroupName("")
                        }}
                        className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#242b3f] hover:text-white transition-colors duration-150'
                    >
                        <X size={18}/>
                    </button>

                </div>


                {/* Search */}
                <div className='w-full bg-[#141720] h-[46px] rounded-lg flex items-center gap-2.5 px-3.5 mb-4 border border-[#2a3040] focus-within:border-[#4c7dff]/50 transition-colors duration-150'>

                    <Search
                        size={16}
                        className='text-gray-500'
                    />

                    <input
                        value={searchQuery}
                        onChange={(e)=>setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className='flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-gray-500'
                    />

                </div>


                {/* Users */}
                <div className='flex-1 overflow-y-auto pr-1 space-y-1'>

                    {
                        loading ?

                        <div className='h-full flex flex-col justify-center items-center gap-3'>

                            <div className='w-14 h-14 rounded-full bg-[#1d2235] flex items-center justify-center'>

                                <UsersIcon
                                    size={26}
                                    fill="#4c7dff"
                                    className='text-[#4c7dff]'
                                />

                            </div>

                            <p className='text-white font-medium text-[14.5px]'>
                                Loading users
                            </p>

                            <p className='text-gray-500 text-[12.5px]'>
                                Fetching your contacts...
                            </p>

                            <Loader2
                                size={22}
                                className='text-[#4c7dff] animate-spin'
                            />

                        </div>

                        :

                        filteredUsers.length > 0 ?

                        filteredUsers.map((user,idx) => {

                            const isSelected =
                                selectedUsers.includes(user._id)

                            return (

                                <div
                                    key={idx}
                                    onClick={() => handleUserSelect(user._id)}
                                    className={`
                                        min-h-[64px] w-full flex items-center justify-between
                                        px-4 py-2 mt-1 rounded-lg cursor-pointer
                                        border transition-colors duration-150
                                        ${
                                            isSelected
                                            ? 'bg-[#4c7dff]/10 border-[#4c7dff]/60'
                                            : 'border-transparent hover:bg-[#242b3f]'
                                        }
                                    `}
                                >

                                    <div className='flex items-center gap-3 min-w-0'>

                                        {/* Avatar */}
                                        <div className='rounded-full bg-[#141720] h-[42px] w-[42px] flex justify-center items-center overflow-hidden ring-1 ring-[#2a3142] flex-shrink-0'>

                                            {
                                                user.pfp ?

                                                <img
                                                    src={user.pfp}
                                                    className='h-full w-full object-cover'
                                                />

                                                :

                                                <p className='text-white text-[14px] font-medium'>
                                                    {user.username?.[0]?.toUpperCase()}
                                                </p>
                                            }

                                        </div>


                                        <p className='text-[14px] text-gray-100 font-medium truncate max-w-[260px]'>
                                            {user.username}
                                        </p>

                                    </div>


                                    {/* Selection */}
                                    <div
                                        className={`
                                            w-4 h-4 rounded-full border-2 
                                            flex items-center justify-center 
                                            flex-shrink-0 transition-colors duration-150
                                            ${
                                                isSelected
                                                ? "bg-[#4c7dff] border-[#4c7dff]"
                                                : "border-[#3a4155]"
                                            }
                                        `}
                                    >
                                        {
                                            isSelected &&
                                            <div className='w-1.5 h-1.5 rounded-full bg-white'/>
                                        }

                                    </div>


                                </div>

                            )
                        })

                        :

                        <div className='h-full flex justify-center items-center'>
                            <p className='text-gray-500 text-[13.5px]'>
                                No users found
                            </p>
                        </div>

                    }

                </div>


                {/* Footer */}
                <div className='mt-4 pt-4 border-t border-[#2a3040] flex justify-between'>

                    <button
                        onClick={()=>{
                            setSelectUsersForGroupPopupOpen(false)
                            setCreateGroupPopupOpen(true)
                        }}
                        className='px-4 py-2.5 bg-[#242b3f] rounded-lg text-[13.5px] font-medium text-gray-300 flex items-center gap-1.5 hover:bg-[#2b3346] transition-colors duration-150'
                    >
                        <ArrowLeftIcon size={16}/>
                        Back
                    </button>


                    <button
                        disabled={selectedUsers.length === 0}
                        onClick={handleCreateGroup}
                        className='px-4 py-2.5 bg-[#4c7dff] rounded-lg text-[13.5px] font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3f6ee8] transition-colors duration-150 shadow-sm'
                    >
                        Create Group
                    </button>

                </div>

            </div>

        </div>
    )
}

export default SelectUsersForGroupPopup
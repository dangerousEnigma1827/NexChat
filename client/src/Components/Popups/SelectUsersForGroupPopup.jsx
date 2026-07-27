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

    const {
        groupName,
        groupDescription
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
        <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100000]'>

            <div className='w-[550px] h-[600px] bg-[#1b2130] border border-[#2e3548] rounded-2xl shadow-2xl p-6 flex flex-col'>

                <div className='flex items-center justify-between mb-6'>

                    <div>
                        <h1 className='text-2xl font-bold text-white'>
                            Select Users
                        </h1>

                        <p className='text-sm text-gray-400 mt-1'>
                            Choose members for your group
                        </p>
                    </div>

                    <button
                        onClick={() => setSelectUsersForGroupPopupOpen(false)}
                        className='text-gray-400 hover:text-white transition'
                    >
                        <X size={22}/>
                    </button>

                </div>

                <div className='w-full bg-[#141720] h-[58px] rounded-xl flex items-center gap-3 px-4 mb-5 border border-[#2e3548]'>

                    <Search
                        size={18}
                        className='text-gray-400'
                    />

                    <input
                        value={searchQuery}
                        onChange={(e)=>setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className='flex-1 bg-transparent outline-none text-white placeholder:text-gray-500'
                    />

                </div>

                <div className='flex-1 overflow-y-auto pr-1'>

                    {
                        loading ?

                        <div className='h-full flex flex-col justify-center items-center gap-4'>

                            <div className='w-16 h-16 rounded-full bg-[#1d2235] flex items-center justify-center'>

                                <UsersIcon
                                    size={32}
                                    fill="#4c7dff"
                                    className='text-[#4c7dff]'
                                />

                            </div>

                            <p className='text-white font-medium text-lg'>
                                Loading users
                            </p>

                            <p className='text-gray-400 text-sm'>
                                Fetching your contacts...
                            </p>

                            <Loader2
                                size={28}
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
                                        h-[75px] w-full flex items-center
                                        px-4 mb-2 rounded-xl cursor-pointer
                                        transition
                                        ${isSelected
                                            ? 'border border-[#4c7dff]'
                                            : 'hover:bg-[#2b3142]'
                                        }
                                    `}
                                >

                                    <div className='flex items-center gap-4'>

                                        <div className='rounded-full bg-[#141720] h-[52px] w-[52px] flex justify-center items-center overflow-hidden'>

                                            {
                                                user.pfp ?

                                                <img
                                                    src={user.pfp}
                                                    className='h-full w-full object-cover'
                                                />

                                                :

                                                <p className='text-white text-lg font-medium'>
                                                    {user.username?.[0]?.toUpperCase()}
                                                </p>
                                            }

                                        </div>

                                        <p className='text-white'>
                                            {user.username}
                                        </p>

                                    </div>

                                </div>
                            )
                        })

                        :

                        <div className='h-full flex justify-center items-center'>
                            <p className='text-gray-400'>
                                No users found
                            </p>
                        </div>
                    }

                </div>

                <div className='mt-5 pt-5 flex justify-between'>

                    <button
                        onClick={()=>{
                            console.log("clicking")
                            setSelectUsersForGroupPopupOpen(false)
                            setCreateGroupPopupOpen(true)
                        }}
                        className='px-5 py-2.5 bg-[#2b3142] rounded-lg text-white flex items-center gap-1 hover:bg-[#363d50] transition'
                    >
                        <ArrowLeftIcon size={20}/>
                        Back
                    </button>

                    <button
                        disabled={selectedUsers.length === 0}
                        onClick={handleCreateGroup}
                        className='px-5 py-2.5 bg-[#4c7dff] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3f6ee8] transition'
                    >
                        Create Group
                    </button>

                </div>

            </div>

        </div>
    )
}

export default SelectUsersForGroupPopup
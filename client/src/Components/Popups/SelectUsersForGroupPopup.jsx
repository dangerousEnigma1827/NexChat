import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

function SelectUsersForGroupPopup({
    setSelectUsersForGroupPopupOpen,
    setCreateGroupPopupOpen
}) {

    const token = localStorage.getItem('token')

    const [allSingleUsers, setAllSingleUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])

    const handleAllSingleUsers = async () => {
        try {
            const allSingleUsersReq = await axios.get(
                'http://localhost:5000/api/conversations/getAllSingleUsers',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setAllSingleUsers(allSingleUsersReq.data)
        } catch (err) {
            console.log('error getting all single users in frontend', err)
        }
    }

    useEffect(() => {
        handleAllSingleUsers()
    }, [])

    const filteredUsers = allSingleUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleUserSelect = (userId) => {
        // setSelectedUsers(prev =>
        //     prev.includes(userId)
        //         ? prev.filter(id => id !== userId)
        //         : [...prev, userId]
        // )

        if(selectedUsers.includes(userId)){
            let newUsers = selectedUsers.filter((user)=>{
                return user != userId
            })

            setSelectedUsers(newUsers)
        }else{
            setSelectedUsers((prev)=>{
                return [...prev, userId]
            })
        }
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100000]'>
            
            <div className='w-[550px] h-[600px] bg-[#1b2130] border border-[#2e3548] rounded-2xl shadow-2xl p-6 flex flex-col'>

                {/* Header */}
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
                        onClick={() => {
                            setSelectUsersForGroupPopupOpen(false)
                        }}
                        className='text-gray-400 hover:text-white transition-all cursor-pointer'
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Search */}
                <div className='w-full bg-[#141720] h-[58px] rounded-xl flex items-center gap-3 px-4 mb-5 border border-[#2e3548]'>
                    <Search size={18} className='text-gray-400' />

                    <input
                        type='text'
                        placeholder='Search users...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='flex-1 bg-transparent outline-none text-white placeholder:text-gray-500'
                    />
                </div>

                {/* Selected Count */}
                <div className='mb-3'>
                    <p className='text-sm text-gray-400'>
                        Selected: {selectedUsers.length}
                    </p>
                </div>

                {/* Users List */}
                <div className='flex-1 overflow-y-auto pr-1'>
                    {
                        filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => {

                                const isSelected = selectedUsers.includes(user._id)

                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => handleUserSelect(user._id)}
                                        className={`h-[75px] w-full flex items-center justify-between px-4 mb-2 rounded-xl cursor-pointer transition-all duration-300
                                        ${isSelected
                                                ? 'bg-[#4c7dff20] border border-[#4c7dff]'
                                                : 'hover:bg-[#2b3142]'
                                            }`}
                                    >
                                        <div className='flex items-center gap-4'>

                                            <div className='rounded-full bg-[#141720] h-[52px] w-[52px] flex justify-center items-center overflow-hidden shrink-0'>
                                                {
                                                    user.pfp ? (
                                                        <img
                                                            src={user.pfp}
                                                            alt={user.username}
                                                            className='h-full w-full object-cover'
                                                        />
                                                    ) : (
                                                        <p className='text-white text-lg font-medium'>
                                                            {user.username?.substring(0, 1).toUpperCase()}
                                                        </p>
                                                    )
                                                }
                                            </div>

                                            <div>
                                                <p className='text-white text-md font-medium'>
                                                    {user.username}
                                                </p>
                                            </div>

                                        </div>

                                        {/* <div
                                            className={`h-5 w-5 rounded-full border-2 transition-all
                                            ${isSelected
                                                    ? 'bg-[#4c7dff] border-[#4c7dff]'
                                                    : 'border-gray-500'
                                                }`}
                                        /> */}
                                    </div>
                                )
                            })
                        ) : (
                            <div className='h-full flex justify-center items-center'>
                                <p className='text-gray-400'>
                                    No users found
                                </p>
                            </div>
                        )
                    }
                </div>

                {/* Footer */}
                <div className='mt-5 pt-5 flex justify-between items-center'>

                    <button
                        className='px-5 py-2.5 bg-[#2b3142] hover:bg-[#363d50] rounded-lg text-white transition-all cursor-pointer'
                        onClick={() => {
                            setSelectUsersForGroupPopupOpen(false)
                            setCreateGroupPopupOpen(true)
                        }}
                    >
                        ← Back
                    </button>

                    <button
                        className='px-5 py-2.5 bg-[#4c7dff] hover:bg-[#3f6ee8] rounded-lg text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={selectedUsers.length === 0}
                    >
                        Create Group
                    </button>

                </div>

            </div>
        </div>
    )
}

export default SelectUsersForGroupPopup
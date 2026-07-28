// CreateGroupPopup.jsx
import React, { useContext } from 'react'
import { useState } from 'react'
import {ChatsCircleIcon, ChatCircleTextIcon, KeyIcon, EnvelopeIcon, UserIcon, CloudArrowUpIcon, ArrowRightIcon} from "@phosphor-icons/react"
import { GroupContext } from '../../context/groupContext'

function CreateGroupPopup({setCreateGroupPopupOpen, setSelectUsersForGroupPopupOpen, setActive}) {

    let [cloudinaryUrl, setCloudinaryUrl] = useState(null)
    let [isDisabled, setIsDisabled] = useState(false)

    let {
        groupName, groupDescription,
    setGroupName, setGroupDescription
    } = useContext(GroupContext)

    let handlePfp = async (e) =>{
        setIsDisabled(true)
        let file = e.target.files[0]
        if(!file){

        }else{
            let data = new FormData()
            data.append("file", file)
            data.append("upload_preset", "NexChatUploadPreset")
            data.append("cloud_name", "dgv5nxqxx")


            let res = await fetch("https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload", {
                method:"POST",
                body: data
            })

            const imageUploadurl = await res.json()
            console.log(imageUploadurl)
            setCloudinaryUrl(imageUploadurl.url)
            setIsDisabled(false)
        }
    }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100000] px-4'>
        <div className='w-full max-w-[480px] bg-[#1b2130] border border-[#2a3040] rounded-xl shadow-2xl p-6'>
            <div className='flex flex-col items-center gap-1 mb-6'>
                <h1 className='text-[18px] font-semibold text-white'>Create New Group</h1>
                <p className='text-[12.5px] text-gray-500'>Add a name, description and icon</p>
            </div>
            <div className='flex justify-center mb-6'>
                <label className='relative cursor-pointer group'>
                    <div className='h-[110px] w-[110px] rounded-full overflow-hidden border-2 border-[#2a3142] group-hover:border-[#4c7dff]/50 transition-colors duration-150 ring-2 ring-[#1b2130]'>
                        {
                            cloudinaryUrl ?
                            (
                                <img src={cloudinaryUrl} className='h-full w-full object-cover'/>
                            )
                            :
                            (
                                <div className='h-full w-full bg-[#141720] flex flex-col items-center justify-center gap-1.5'>
                                    {/* <CloudArrowUpIcon size={28} color="#4c7dff" className='group-hover:scale-110 transition'/> */}
                                    <p className='text-[11px] text-gray-500 text-center px-3 leading-tight'>Upload<br/>Group Icon</p>
                                </div>
                            )
                        }
                    </div>
                    <input type="file" className='hidden' onChange={handlePfp}/>
                </label>

            </div>

            <div className='flex flex-col gap-3'>
                <div className='bg-[#141720] border border-[#2a3040] focus-within:border-[#4c7dff]/50 rounded-lg flex items-center px-3.5 transition-colors duration-150'>
                    <UserIcon size={17} color="#6b7280" weight='fill'/>
                    <input type="text" placeholder='Group Name' className='w-full h-[46px] bg-transparent outline-none text-[14px] text-white placeholder:text-gray-500 ml-2.5' value={groupName} 
                    onChange={(e)=>setGroupName(e.target.value)}/>
                </div>

                <div className='bg-[#141720] border border-[#2a3040] focus-within:border-[#4c7dff]/50 rounded-lg flex px-3.5 py-3 gap-2.5 transition-colors duration-150'>
                    <ChatsCircleIcon size={17} color="#6b7280" weight='fill' className='mt-0.5'/>
                    <textarea placeholder='Describe your group...' rows={3} value={groupDescription} onChange={(e)=>setGroupDescription(e.target.value)} className='w-full bg-transparent outline-none border-none text-[14px] text-white placeholder:text-gray-500 resize-none'/>
                </div>
            </div>

            <div className='flex justify-end mt-6 gap-2.5'>
                <button className='px-4 py-2.5 rounded-lg bg-[#242b3f] text-[13.5px] font-medium text-gray-300 hover:bg-[#2b3346] transition-colors duration-150' onClick={(e)=>{
                    setGroupName("")
                    setGroupDescription("")
                    setCloudinaryUrl("")
                    setCreateGroupPopupOpen(false)
                    setActive("chats")
                }}>Cancel</button>

                <button className='px-4 py-2.5 rounded-lg bg-[#4c7dff] hover:bg-[#3f6ee8] text-[13.5px] font-medium text-white flex items-center gap-1.5 transition-colors duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed' disabled={(isDisabled) || (groupName.trim() == "" || groupDescription.trim() == "")} onClick={(e)=>{
                    console.log("clicked")
                    setActive("chats")
                    setCreateGroupPopupOpen(false)
                    setSelectUsersForGroupPopupOpen(true)

                }}>Next<ArrowRightIcon size={16}/></button>
            </div>
        </div>
    </div>
  )
}

export default CreateGroupPopup
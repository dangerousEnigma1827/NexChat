import React from 'react'
import { useState } from 'react'
import {ChatsCircleIcon, ChatCircleTextIcon, KeyIcon, EnvelopeIcon, UserIcon, CloudArrowUpIcon, ArrowRightIcon} from "@phosphor-icons/react"

function CreateGroupPopup({setCreateGroupPopupOpen, setSelectUsersForGroupPopupOpen}) {

    let [cloudinaryUrl, setCloudinaryUrl] = useState(null)
    let [groupName, setGroupName] = useState("")
    let [groupDescription, setGroupDescription] = useState("")

    let handlePfp = async (e) =>{
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
        }
    }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100000]'>
        <div className='w-[600px] bg-[#1b2130] border border-[#2e3548] rounded-2xl shadow-2xl p-8'>
            <div className='flex flex-col items-center gap-2 mb-8'>
                <h1 className='text-2xl font-bold text-white'>Create New Group</h1>
            </div>
            <div className='flex justify-center mb-8'>
                <label className='relative cursor-pointer group'>
                    <div className='h-[170px] w-[170px] rounded-full overflow-hidden border-[3px] border-[#3b82f6] shadow-lg'>
                        {
                            cloudinaryUrl ?
                            (
                                <img src={cloudinaryUrl} className='h-full w-full object-cover'/>
                            )
                            :
                            (
                                <div className='h-full w-full bg-[#11151f] flex flex-col items-center justify-center gap-2'>
                                    <CloudArrowUpIcon size={55} color="#3b82f6" className='group-hover:scale-110 transition'/>
                                    <p className='text-xs text-gray-400'>Upload Group Icon</p>
                                </div>
                            )
                        }
                    </div>
                    <input type="file" className='hidden' onChange={handlePfp}/>
                </label>

            </div>

            <div className='flex flex-col gap-4'>
                <div className='bg-[#11151f] border border-[#2e3548] rounded-xl flex items-center px-4'>
                    <UserIcon size={20} color="#3b82f6" weight='fill'/>
                    <input type="text" placeholder='Group Name' className='w-full h-[60px] bg-transparent outline-none text-white placeholder:text-gray-500 ml-3' value={groupName} 
                    onChange={(e)=>setGroupName(e.target.value)}/>
                </div>

                <div className='bg-[#11151f] border border-[#2e3548] rounded-xl flex px-4 py-3 gap-3'>
                    <ChatsCircleIcon size={20} color="#3b82f6" weight='fill' className='mt-1'/>
                    <textarea placeholder='Describe your group...' rows={4} value={groupDescription} onChange={(e)=>setGroupDescription(e.target.value)} className='w-full bg-transparent outline-none border-none text-white placeholder:text-gray-500 resize-none'/>
                </div>
            </div>

            <div className='flex justify-end mt-8 gap-3'>
                <button className='px-5 py-3 rounded-xl bg-[#2e3548] text-gray-300 hover:bg-[#394158] transition' onClick={(e)=>{setCreateGroupPopupOpen(false)}}>Cancel</button>

                <button className='px-6 py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center gap-2 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed' disabled={groupName.trim() == "" || groupDescription.trim() == ""} onClick={(e)=>{
                    setCreateGroupPopupOpen(false)
                    setSelectUsersForGroupPopupOpen(true)

                }}>Next<ArrowRightIcon size={20}/></button>
            </div>
        </div>
    </div>
  )
}

export default CreateGroupPopup
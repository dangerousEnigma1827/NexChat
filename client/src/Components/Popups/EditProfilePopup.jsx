// EditProfilePopup.jsx
import React, { useContext, useState } from 'react'
import { CameraIcon, UserIcon, PencilSimpleIcon, NotePencilIcon, XIcon } from "@phosphor-icons/react"
import { UserContext } from '../../context/userContext'
import toast from "react-hot-toast"
import api from '../../api/apiInstance'
import LoadingSpin from '../LoadingSpin'

function EditProfilePopup({
    setEditProfilePopupOpen,
    setActive
}) {
    const {
        currentUserUsername,
        currentUserAbout,
        currentUserPfp,
        getCurrentUser
    } = useContext(UserContext)

    const [username,setUsername] = useState(currentUserUsername || "")
    const [about,setAbout] = useState(currentUserAbout || "")
    const [pfp,setPfp] = useState(currentUserPfp || null)
    const [currSrc,setCurrSrc] = useState(currentUserPfp || null)

    // local, presentation-only loading flags — do not touch existing logic
    const [isUploading, setIsUploading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const closePopup = () => {
        setEditProfilePopupOpen(false)
        setActive("chats")
    }

    const uploadFile = async(file)=>{
        setIsUploading(true)
        let data = new FormData()
        data.append("file",file)
        data.append("upload_preset","NexChatUploadPreset")
        data.append("cloud_name","dgv5nxqxx")
        let res = await fetch(
            "https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload",
            { method:"POST", body:data }
        )
        let json = await res.json()
        setCurrSrc(json.secure_url)
        setPfp(json.secure_url)
        setIsUploading(false)
    }

    const handleSave = async()=>{
        if(!username){
            toast("Username Cant Be Empty!",{
                style:{ background:"#3b82f6", color:"#fff" }
            })
            return
        }
        try{
            setIsSaving(true)
            await api.post('/auth/me/edit',{ username, about, pfp })
            await getCurrentUser()
            toast("Profile Updated Successfully!",{
                style:{ background:"#3b82f6", color:"#fff" }
            })
            closePopup()
        }
        catch(err){
            console.log(err)
        }
        finally{
            setIsSaving(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100000] px-4'>
            <div className='w-full max-w-[440px] bg-[#1b2130] rounded-xl border border-[#2a3040] p-6 shadow-2xl relative'>
                {/* Header */}
                <div className='flex items-center justify-between mb-1'>
                    <div className='flex flex-col'>
                        <h1 className='text-[16px] text-white font-semibold'>Edit Profile</h1>
                        <p className='text-gray-500 text-[12.5px]'>Update your profile details</p>
                    </div>
                    <button onClick={closePopup} className='w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#242b3f] hover:text-white transition-colors duration-150'>
                        <XIcon size={16}/>
                    </button>
                </div>
                {/* Avatar */}
                <div className='flex justify-center mt-5'>
                    <div className='relative group'>
                        {
                            currSrc ?
                            <img src={currSrc} className='w-[92px] h-[92px] rounded-full object-cover ring-2 ring-[#4c7dff]/40' />
                            :
                            <div className='w-[92px] h-[92px] rounded-full bg-[#141720] flex justify-center items-center ring-2 ring-[#2a3142]'>
                                <UserIcon size={32} className='text-gray-500'/>
                            </div>
                        }
                        {
                            isUploading &&
                            <div className='absolute inset-0 rounded-full bg-black/60 flex items-center justify-center'>
                                <LoadingSpin />
                            </div>
                        }
                        <label className='absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#4c7dff] hover:bg-[#3f6ee8] flex justify-center items-center cursor-pointer transition-colors duration-150 ring-2 ring-[#1b2130]'>
                            <CameraIcon size={13} color="white"/>
                            <input type="file" className='hidden' onChange={(e)=>{
                                let file=e.target.files[0]
                                if(file) uploadFile(file)
                            }} />
                        </label>
                    </div>
                </div>
                {/* Inputs */}
                <div className='mt-6 space-y-3'>
                    <div className='bg-[#141720] border border-[#2a3040] focus-within:border-[#4c7dff]/50 h-[46px] rounded-lg px-3.5 flex items-center gap-2.5 transition-colors duration-150'>
                        <UserIcon size={16} className='text-gray-500'/>
                        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className='bg-transparent outline-none text-[14px] text-white placeholder:text-gray-500 w-full' />
                    </div>
                    <div className='bg-[#141720] border border-[#2a3040] focus-within:border-[#4c7dff]/50 rounded-lg p-3.5 flex gap-2.5 transition-colors duration-150'>
                        <NotePencilIcon size={16} className='text-gray-500 mt-0.5'/>
                        <textarea rows={3} value={about} onChange={(e)=>setAbout(e.target.value)} placeholder="Write a little about yourself..." className='bg-transparent outline-none text-[14px] text-white placeholder:text-gray-500 w-full resize-none' />
                    </div>
                </div>
                {/* Buttons */}
                <div className='flex gap-2.5 mt-6'>
                    <button onClick={closePopup} className='flex-1 h-[44px] rounded-lg bg-[#242b3f] text-[13.5px] font-medium text-gray-300 hover:bg-[#2b3346] transition-colors duration-150'>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className='flex-1 h-[44px] rounded-lg bg-[#4c7dff] hover:bg-[#3f6ee8] disabled:opacity-60 disabled:cursor-not-allowed text-[13.5px] font-medium text-white flex justify-center items-center gap-2 transition-colors duration-150 shadow-sm'>
                        {
                            isSaving ?
                            <>
                                <LoadingSpin />
                                <span>Saving...</span>
                            </>
                            :
                            <>
                                <PencilSimpleIcon size={15}/>
                                <span>Save Changes</span>
                            </>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfilePopup
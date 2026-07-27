import React, { useContext, useState } from 'react'
import {
  CameraIcon,
  UserIcon,
  PencilSimpleIcon,
  NotePencilIcon
} from "@phosphor-icons/react"

import { UserContext } from '../../context/userContext'
import toast from "react-hot-toast"
import api from '../../api/apiInstance'


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



    const [username,setUsername] = useState(
        currentUserUsername || ""
    )

    const [about,setAbout] = useState(
        currentUserAbout || ""
    )

    const [pfp,setPfp] = useState(
        currentUserPfp || null
    )


    const [currSrc,setCurrSrc] = useState(
        currentUserPfp || null
    )



    const closePopup = () => {
        setEditProfilePopupOpen(false)
        setActive("chats")
    }




    const uploadFile = async(file)=>{

        let data = new FormData()

        data.append("file",file)
        data.append("upload_preset","NexChatUploadPreset")
        data.append("cloud_name","dgv5nxqxx")


        let res = await fetch(
            "https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload",
            {
                method:"POST",
                body:data
            }
        )


        let json = await res.json()


        setCurrSrc(json.secure_url)
        setPfp(json.secure_url)

    }





    const handleSave = async()=>{


        if(!username){

            toast("Username Cant Be Empty!",{
                style:{
                    background:"#3b82f6",
                    color:"#fff"
                }
            })

            return
        }



        try{

            await api.post('/auth/me/edit',{
                username,
                about,
                pfp
            })


            await getCurrentUser()


            toast("Profile Updated Successfully!",{
                style:{
                    background:"#3b82f6",
                    color:"#fff"
                }
            })


            closePopup()


        }
        catch(err){

            console.log(err)

        }


    }





    return (

        <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[100000]'>


            <div className='w-[540px] bg-[#1b2130] rounded-3xl border border-[#2e3548] p-8 shadow-2xl relative'>


                {/* Close */}

                <button
                    onClick={closePopup}
                    className='absolute top-6 right-6 text-gray-400 hover:text-white text-xl'
                >
                    ✕
                </button>




                {/* Header */}

                <div className='text-center'>

                    <h1 className='text-2xl text-white font-semibold'>
                        Edit Profile
                    </h1>

                    <p className='text-gray-400 mt-1 text-sm'>
                        Update your profile details
                    </p>

                </div>






                {/* Avatar */}

                <div className='flex justify-center mt-8'>


                    <div className='relative group'>


                        {
                            currSrc ?

                            <img
                                src={currSrc}
                                className='w-[120px] h-[120px] rounded-full object-cover border-4 border-[#3b82f6]'
                            />

                            :

                            <div className='w-[120px] h-[120px] rounded-full bg-[#11151f] flex justify-center items-center border-4 border-[#3b82f6]'>

                                <UserIcon size={42} color="#3b82f6"/>

                            </div>
                        }



                        <label className='absolute bottom-1 right-1 h-10 w-10 rounded-full bg-[#3b82f6] flex justify-center items-center cursor-pointer'>


                            <CameraIcon size={18} color="white"/>


                            <input
                                type="file"
                                className='hidden'
                                onChange={(e)=>{

                                    let file=e.target.files[0]

                                    if(file)
                                        uploadFile(file)

                                }}
                            />


                        </label>


                    </div>


                </div>








                {/* Inputs */}


                <div className='mt-8 space-y-4'>


                    <div className='bg-[#11151f] h-[52px] rounded-xl px-4 flex items-center gap-3'>


                        <UserIcon size={18} color="#3b82f6"/>


                        <input

                            value={username}

                            onChange={(e)=>setUsername(e.target.value)}

                            placeholder="Username"

                            className='bg-transparent outline-none text-white w-full'

                        />


                    </div>





                    <div className='bg-[#11151f] rounded-xl p-4 flex gap-3'>


                        <NotePencilIcon size={18} color="#3b82f6"/>


                        <textarea

                            rows={4}

                            value={about}

                            onChange={(e)=>setAbout(e.target.value)}

                            placeholder="Write a little about yourself..."

                            className='bg-transparent outline-none text-white w-full resize-none'

                        />


                    </div>



                </div>







                {/* Buttons */}


                <div className='flex gap-3 mt-7'>


                    <button

                        onClick={closePopup}

                        className='flex-1 h-[52px] rounded-xl bg-[#11151f] text-gray-300 hover:bg-[#181d29] transition'

                    >

                        Cancel

                    </button>





                    <button

                        onClick={handleSave}

                        className='flex-1 h-[52px] rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white flex justify-center items-center gap-2 transition'

                    >

                        <PencilSimpleIcon size={18}/>

                        Save Changes


                    </button>


                </div>



            </div>


        </div>

    )
}


export default EditProfilePopup
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {ChatsCircleIcon, ChatCircleTextIcon, KeyIcon, EnvelopeIcon, UserIcon, CloudArrowUpIcon} from "@phosphor-icons/react"
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import axios from 'axios';


function Register() {
  
  let navigate = useNavigate()
  let [username, setUsername] = useState()
  let [password, setPassword] = useState()
  let [email, setEmail] = useState()
  let[lastMessageSent, setLastMessageSent] = useState({})
  let[lastTimeMessageSent, setLastTimeMessageSent] = useState({})
  let [imageSrc, setImageSrc] = useState(null);
  let [cloudinaryUrl, setCloudinaryUrl] = useState(null)


  let hangleRegister = async () =>{
    if(username && email && password){
      try{
        let handleRegisterInFrontend = await axios.post('http://localhost:5000/api/auth/register', {
          username, email, password,lastMessageSent , lastTimeMessageSent, "pfp":cloudinaryUrl
        })

        console.log(handleRegisterInFrontend.data)

        navigate('/login')
        toast("Registered Successfully!", {
          style: { background: '#3b82f6', color: '#fff' }
        })
      }catch(err){
        toast(err.response?.data?.message || "Registering failed", {
          style: { background: '#3b82f6', color: '#fff' }
        })
        console.log("error in handling regisrer in frontend");
      }
    }else{
      toast("Inputs cant be empty!", {
        style: { background: '#3b82f6', color: '#fff' }
      })
    }
  }

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

  // useEffect(()=>{
  //   setImageSource(pfpurl)
  // }, [pfpurl])

  return (
    <div className='h-screen w-screen bg-[#141720] flex justify-center items-center'>
      {/* main container */}
        <div className='bg-[#212634] rounded-md h-[70vh] w-[50vw] flex flex-col items-center '>
          {/* top */}
            <div className=' gap-2  w-[95%] mt-10 mb-3 flex flex-col items-center'>
                    <div className='flex gap-2'>
                      <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='' />
                      <p className='text-white title text-3xl font-normal '>NexChat</p>
                    </div>
                    <p className='text-gray-400/80'>New to Nexchat? Register Now!</p>
            </div>


            {/* bottom */}
            <div className='w-[95%] flex gap-2 mt-5'>
              {/* left of bottom */}
              <div className='w-1/2 flex flex-col justify-center items-center gap-3 px-6'>
                <p className='text-white text-md ont-medium border-b-2 border-b-[#3b82f6]'>Profile Picture</p>
                <div className='relative group cursor-pointer'>

                          <div className='h-[160px] w-[160px] rounded-full border-4 border-[#3b82f6]/40 bg-[#141720] flex justify-center items-center overflow-hidden shadow-lg'>
                              {
                                !cloudinaryUrl && <CloudArrowUpIcon size={70} color="#3b82f6"className='group-hover:scale-110 transition-all duration-300'/>
                              }
                              {
                                cloudinaryUrl && <img src={cloudinaryUrl} className='h-full w-full object-cover' />
                              }
                          </div>

                    {/* glow */}
                    <div className='absolute inset-0 rounded-full bg-[#3b82f6]/10 blur-2xl -z-10'></div>
                </div>

                <label className='cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-md transition-all duration-300 text-sm font-medium shadow-md'>
                    Upload Image
                    <input type="file" className='hidden' onChange={(e)=>{handlePfp(e)}}/>
                </label>

                {/* <p className='text-gray-400 text-sm text-center max-w-[250px]'>Choose a cool profile picture to personalize your account.</p> */}

              </div>

              {/* right of bottom */}
              <div className='flex flex-col gap-4 w-1/2 justify-center items-center'>
                <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <UserIcon size={20} color="#3b82f6" weight="fill" className='ml-4'/>
                    <input type="text" placeholder='Username' className='outline-none bg-transparent text-white  h-[7vh] text-md placeholder:text-gray-500' value={username} onChange={(e)=>{
                      setUsername(e.target.value)
                    }}/>
                </div>
                <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <EnvelopeIcon size={20} color="#3b82f6" weight="fill" className='ml-4' />
                    <input type="text" placeholder='Email' className='outline-none bg-transparent text-white  h-[7vh] text-md placeholder:text-gray-500' value={email} onChange={(e)=>{
                      setEmail(e.target.value)
                    }}/>
                </div>
                <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <KeyIcon size={20} color="#3b82f6" weight="fill" className='ml-4'/>
                    <input type="password" placeholder='Password' className='outline-none bg-transparent text-white  h-[7vh] text-md placeholder:text-gray-500' value={password} onChange={(e)=>{
                      setPassword(e.target.value)
                    }}/>
                </div>
                <button className='w-[80%] bg-[#3b82f6] rounded-md cursor-pointer text-white h-[7vh]' onClick={(e)=>{hangleRegister()}}>Register</button>
              </div>
            </div>

            <div>
              <p className='text-white mt-10 mb-10'>Already Have An Account? <span className='text-[#3b82f6] cursor-pointer text-underlined' onClick={(e)=>{
                navigate('/login')
              }}>Login Here!</span></p>
            </div>
        </div>
    </div>
  )
}

export default Register
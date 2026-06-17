import React, { useState } from 'react'
import { ChatsCircleIcon, KeyIcon, EnvelopeIcon, UserIcon, CloudArrowUpIcon } from "@phosphor-icons/react"
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import api from '../api/apiInstance';

function Register() {

  let navigate = useNavigate()
  let [username, setUsername] = useState()
  let [password, setPassword] = useState()
  let [email, setEmail] = useState()
  let [cloudinaryUrl, setCloudinaryUrl] = useState(null)

  let hangleRegister = async () => {
    if (username && email && password) {
      try {
        await api.post('/auth/register', {
          username,
          email,
          password,
          pfp: cloudinaryUrl
        })

        navigate('/login')
        toast("Registered Successfully!", {
          style: { background: '#3b82f6', color: '#fff' }
        })
      } catch (err) {
        toast(err.response?.data?.message || "Registering failed", {
          style: { background: '#3b82f6', color: '#fff' }
        })
      }
    } else {
      toast("Inputs can't be empty!", {
        style: { background: '#3b82f6', color: '#fff' }
      })
    }
  }

  let handlePfp = async (e) => {
    let file = e.target.files[0]
    if (!file) return

    let data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "NexChatUploadPreset")
    data.append("cloud_name", "dgv5nxqxx")

    let res = await fetch("https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload", {
      method: "POST",
      body: data
    })

    let json = await res.json()
    setCloudinaryUrl(json.url)
  }

  return (
  <div className='h-screen w-screen bg-[#141720] flex justify-center items-center px-4'>

    {/* main container */}
    <div className='bg-[#212634] rounded-md w-full max-w-3xl flex flex-col'>

      {/* top */}
      <div className='w-[95%] mt-10 mb-3 flex flex-col items-center gap-2 mx-auto'>
        <div className='flex gap-2'>
          <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='shrink-0'/>
          <p className='text-white title text-3xl font-normal'>NexChat</p>
        </div>
        <p className='text-gray-400/80'>New to Nexchat? Register Now!</p>
      </div>

      {/* bottom */}
      <div className='w-[95%] flex flex-col md:flex-row gap-10 md:gap-2 mt-5 mx-auto'>

        {/* left */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center gap-3 px-6'>

          <p className='text-white text-md font-medium border-b-2 border-b-[#3b82f6]'>
            Profile Picture
          </p>

          <div className='relative group cursor-pointer'>

            <div className='h-[160px] w-[160px] rounded-full border-4 border-[#3b82f6]/40 bg-[#141720] flex justify-center items-center overflow-hidden shadow-lg'>
              {!cloudinaryUrl && (
                <CloudArrowUpIcon size={70} color="#3b82f6" className='group-hover:scale-110 transition-all duration-300' />
              )}
              {cloudinaryUrl && (
                <img src={cloudinaryUrl} className='h-full w-full object-cover' />
              )}
            </div>

            <div className='absolute inset-0 rounded-full bg-[#3b82f6]/10 blur-2xl -z-10'></div>
          </div>

          <label className='cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-md transition-all duration-300 text-sm font-medium shadow-md'>
            Upload Image
            <input type="file" className='hidden' onChange={(e) => { handlePfp(e) }} />
          </label>

        </div>

        {/* right */}
        <div className='flex flex-col gap-4 w-full md:w-1/2 justify-center items-center'>

          <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex items-center gap-2'>
            <UserIcon size={20} color="#3b82f6" weight="fill" className='ml-4 shrink-0' />
            <input type="text" placeholder='Username'
              className='outline-none bg-transparent text-white h-[7vh] text-md placeholder:text-gray-500'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex items-center gap-2'>
            <EnvelopeIcon size={20} color="#3b82f6" weight="fill" className='ml-4 shrink-0' />
            <input type="text" placeholder='Email'
              className='outline-none bg-transparent text-white h-[7vh] text-md placeholder:text-gray-500'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex items-center gap-2'>
            <KeyIcon size={20} color="#3b82f6" weight="fill" className='ml-4 shrink-0' />
            <input type="password" placeholder='Password'
              className='outline-none bg-transparent text-white h-[7vh] text-md placeholder:text-gray-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className='w-[80%] bg-[#3b82f6] rounded-md cursor-pointer text-white h-[7vh]'
            onClick={hangleRegister}
          >
            Register
          </button>

        </div>
      </div>

      {/* footer */}
      <div className='text-center mb-6'>
        <p className='text-white mt-10'>
          Already Have An Account?{" "}
          <span
            className='text-[#3b82f6] cursor-pointer'
            onClick={() => navigate('/login')}
          >
            Login Here!
          </span>
        </p>
      </div>

    </div>
  </div>
)
}

export default Register
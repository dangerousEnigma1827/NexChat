import React, { useState } from 'react'
import { Search } from 'lucide-react'
import {ChatsCircleIcon, ChatCircleTextIcon, KeyIcon, EnvelopeIcon, UserIcon} from "@phosphor-icons/react"
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

  let hangleRegister = async () =>{
    if(username && email && password){
      try{
        let handleRegisterInFrontend = await axios.post('http://localhost:5000/api/auth/register', {
          username, email, password,lastMessageSent , lastTimeMessageSent
        })

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

  return (
    <div className='h-screen w-screen bg-[#141720] flex justify-center items-center'>
      {/* main container */}
        <div className='bg-[#212634] rounded-md h-[70vh] w-[55vw] flex flex-col items-center '>
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
              <div className='w-1/2'>

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
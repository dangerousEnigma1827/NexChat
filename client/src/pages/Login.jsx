import React from 'react'
import { Search } from 'lucide-react'
import { useState } from 'react'
import {ChatsCircleIcon, ChatCircleTextIcon, KeyIcon, EnvelopeIcon, UserIcon} from "@phosphor-icons/react"
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import api from '../api/apiInstance'

function Login() {
  
  let navigate = useNavigate()
  let [password, setPassword] = useState()
  let [email, setEmail] = useState()

  
  let handleLogin = async () =>{
    if(email && password){
        try{
            let handleLoginInFrontend = await api.post('http://localhost:5000/api/auth/login', {
                email,password
            })

            console.log(handleLoginInFrontend.data)
            localStorage.setItem('token', handleLoginInFrontend.data.token)
            toast("Successfully Logged In!", {
                style: { background: '#3b82f6', color: '#fff' }
            })
            navigate('/')

        }catch(err){
            toast(err.response?.data?.message || "Login failed", {
                style: { background: '#3b82f6', color: '#fff' }
            })
            console.log("error in frontend while logging", err)
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
        <div className='bg-[#212634] rounded-md h-[65vh] w-[28vw] flex flex-col items-center '>
          {/* top */}
            <div className=' gap-2  w-[95%] mt-10 mb-3 flex flex-col items-center'>
                    <div className='flex gap-2'>
                      <ChatsCircleIcon size={32} color="#3b82f6" weight="fill" className='' />
                      <p className='text-white title text-3xl font-normal '>NexChat</p>
                    </div>
                    <p className='text-gray-400/80'>Login to NexChat</p>
            </div>


            {/* bottom */}
            <div className='w-[95%] flex gap-2 mt-5'>

              {/* right of bottom */}
              <div className='flex flex-col gap-4 w-full justify-center items-center'>
                
                <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <EnvelopeIcon size={20} color="#3b82f6" weight="fill" className='ml-4' />
                    <input type="text" placeholder='Email' className='outline-none bg-transparent text-white  h-[7vh] text-md placeholder:text-gray-500 ' value={email} onChange={(e)=>{
                      setEmail(e.target.value)
                    }}/>
                </div>
                <div className='w-[80%] bg-[#141720] h-[7vh] rounded-md flex  items-center gap-2'>
                    <KeyIcon size={20} color="#3b82f6" weight="fill" className='ml-4'/>
                    <input type="password" placeholder='Password' className='outline-none bg-transparent text-white  h-[7vh] text-md placeholder:text-gray-500' value={password} onChange={(e)=>{
                      setPassword(e.target.value)
                    }}/>
                </div>
                <button className='w-[80%] bg-[#3b82f6] rounded-md cursor-pointer text-white h-[7vh]' onClick={(e)=>{handleLogin()}}>Login</button>
              </div>
            </div>

            <div>
              <p className='text-white mt-10 mb-10'>Dont Have An Account? <span className='text-[#3b82f6] cursor-pointer text-underlined' onClick={(e)=>{
                navigate('/register')
              }}>Register Here!</span></p>
            </div>
        </div>
    </div>
  )
}

export default Login
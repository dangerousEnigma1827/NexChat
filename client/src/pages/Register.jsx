import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatsCircleIcon, UserIcon, EnvelopeIcon, KeyIcon } from "@phosphor-icons/react"
import toast from "react-hot-toast";
import { ArrowRight, MoveRight } from 'lucide-react';


function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleNext = () => {
    if (!username || !email || !password){
      toast("Credentials Cant Be Empty!", {
        style: { background: '#3b82f6', color: '#fff' }
      })
        return;
    }

    navigate('/register-step2', {
      state: { username, email, password }
    })
  }

  return (
    <div className="min-h-screen w-full bg-[#141720] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#212634] rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col items-center">

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <ChatsCircleIcon size={40} color="#3b82f6" weight="fill" />
          <h1 className="text-white text-2xl sm:text-3xl font-semibold">NexChat</h1>
        </div>
          <p className="text-gray-400 text-sm sm:text-base text-center mb-6">
            Create an account to start chatting
          </p>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-4">
          {/* Username */}
          <div className="flex items-center bg-[#141720] rounded-lg px-3 sm:px-4 h-12 sm:h-14 ring-1 ring-transparent focus-within:ring-[#3b82f6] transition">
            <UserIcon size={20} color="#3b82f6" weight="fill" />
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent outline-none text-white ml-3 text-sm sm:text-base placeholder:text-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-[#141720] rounded-lg px-3 sm:px-4 h-12 sm:h-14 ring-1 ring-transparent focus-within:ring-[#3b82f6] transition">
            <EnvelopeIcon size={20} color="#3b82f6" weight="fill" />
            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent outline-none text-white ml-3 text-sm sm:text-base placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-[#141720] rounded-lg px-3 sm:px-4 h-12 sm:h-14 ring-1 ring-transparent focus-within:ring-[#3b82f6] transition">
            <KeyIcon size={20} color="#3b82f6" weight="fill" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none text-white ml-3 text-sm sm:text-base placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleNext}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 transition rounded-lg text-white h-12 sm:h-14 font-medium mt-2 flex gap-2 justify-center items-center"
          >
            Continue <ArrowRight size={20}/>
          </button>
        </div>

        {/* Footer */}
        <p className="text-gray-300 text-sm mt-6 text-center">
          Already have an account?{" "}
          <span
            className="text-[#3b82f6] cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register
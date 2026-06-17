import React from 'react'
import { useState } from 'react'
import { ChatsCircleIcon, EnvelopeIcon, KeyIcon } from "@phosphor-icons/react"
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import api from '../api/apiInstance'

function Login() {

  let navigate = useNavigate()
  let [password, setPassword] = useState()
  let [email, setEmail] = useState()

  let handleLogin = async () => {
    if (email && password) {
      try {
        let res = await api.post('http://localhost:5000/api/auth/login', {
          email, password
        })

        localStorage.setItem('token', res.data.token)

        toast("Successfully Logged In!", {
          style: { background: '#3b82f6', color: '#fff' }
        })

        navigate('/')
      } catch (err) {
        toast(err.response?.data?.message || "Login failed", {
          style: { background: '#3b82f6', color: '#fff' }
        })
      }
    } else {
      toast("Inputs can't be empty!", {
        style: { background: '#3b82f6', color: '#fff' }
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#141720] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#212634] rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col items-center">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <ChatsCircleIcon size={40} color="#3b82f6" weight="fill" />
          <h1 className="text-white text-2xl sm:text-3xl font-semibold">NexChat</h1>
          <p className="text-gray-400 text-sm sm:text-base text-center">
            Login to continue your conversations
          </p>
        </div>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-4">

          {/* Email */}
          <div className="flex items-center bg-[#141720] rounded-lg px-3 sm:px-4 h-12 sm:h-14">
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
          <div className="flex items-center bg-[#141720] rounded-lg px-3 sm:px-4 h-12 sm:h-14">
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
            onClick={handleLogin}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 transition rounded-lg text-white h-12 sm:h-14 font-medium"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-gray-300 text-sm mt-6 text-center">
          Don’t have an account?{" "}
          <span
            className="text-[#3b82f6] cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login
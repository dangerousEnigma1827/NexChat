import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ChatsCircleIcon,
  CameraIcon,
  CloudArrowUpIcon,
  NotePencilIcon,
  ArrowLeftIcon
} from "@phosphor-icons/react"
import api from '../api/apiInstance'
import toast from "react-hot-toast"
import { UserRound } from 'lucide-react'

function RegisterStep2() {

  const navigate = useNavigate()
  const location = useLocation()

  const { username, email, password } = location.state || {}

  const [about, setAbout] = useState("")
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null)

  const handlePfp = async (e) => {
    let file = e.target.files[0]
    if (!file) return

    let data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "NexChatUploadPreset")

    let res = await fetch(
      "https://api.cloudinary.com/v1_1/dgv5nxqxx/image/upload",
      { method: "POST", body: data }
    )

    let json = await res.json()
    setCloudinaryUrl(json.url)
  }

  const handleRegister = async () => {
    try {
      let res = await api.post('/auth/register', {
        username,
        email,
        password,
        pfp: cloudinaryUrl,
        about
      })

      console.log("done")

      toast("Registered Successfully!", {
        style: { background: '#3b82f6', color: '#fff' }
      })

      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      toast("Registration failed", {
        style: { background: '#3b82f6', color: '#fff' }
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#141720] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#1b2130] rounded-3xl border border-[#2e3548] p-6 sm:p-8 shadow-2xl relative">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition">
          <ArrowLeftIcon size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChatsCircleIcon size={40} color="#3b82f6" weight="fill" />
          <h1 className="text-white text-2xl sm:text-3xl font-semibold">NexChat</h1>
        </div>
          <p className="text-gray-400 text-sm text-center">
            Add a face and a few words, or skip for now
          </p>


        {/* Avatar */}
        <div className="flex justify-center mt-6">
          <div className="relative group cursor-pointer">

            {cloudinaryUrl ? (
              <img
                src={cloudinaryUrl}
                className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[#3b82f6]"
                alt="Profile preview"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-[#11151f] flex justify-center items-center border-2 border-[#3b82f6]">
                <UserRound size={42} color="#3b82f6" />
              </div>
            )}

            <label className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-[#3b82f6] flex justify-center items-center cursor-pointer group-hover:scale-105 transition">
              <CameraIcon size={18} color="white" />
              <input type="file" className="hidden" accept="image/*" onChange={handlePfp} />
            </label>

          </div>
        </div>

        {/* About */}
        <div className="mt-7 space-y-4">
          <div className="bg-[#11151f] rounded-xl p-4 flex items-start gap-3">
            <NotePencilIcon size={18} color="#3b82f6" className="mt-1 flex-shrink-0" />
            <textarea
              rows={4}
              placeholder="Write a little about yourself..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-transparent outline-none text-white resize-none border-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-7">

          <button
            onClick={handleRegister}
            className="flex-1 h-[52px] rounded-xl bg-[#11151f] text-gray-300 hover:bg-[#181d29] transition"
          >
            Skip for now
          </button>

          <button
            onClick={handleRegister}
            className="flex-1 h-[52px] rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium transition"
          >
            Finish
          </button>
        </div>

      </div>
    </div>
  )
}

export default RegisterStep2
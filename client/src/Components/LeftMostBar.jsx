import React from 'react'
import { ChatCircleTextIcon, SignOutIcon, UsersIcon } from "@phosphor-icons/react"
import { CircleUserRound, UserIcon } from 'lucide-react'

function LeftMostBar({ setLogoutPopupOpen, setCreateGroupPopupOpen, setUserProfilePopupOpen }) {
  return (
    <div className="w-[70px] h-full bg-[#141720] flex flex-col items-center justify-between py-6 border-r border-[#1d2230]">

      {/* TOP ICONS */}
      <div className="flex flex-col gap-6">

        {/* Chats */}
        <button className="group flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#22283a] transition">
          <ChatCircleTextIcon
            size={24}
            color="#ffffff"
            weight="fill"
            className="group-hover:scale-110 transition"
          />
        </button>

        <button
          className="group flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#22283a] transition"
          onClick={() => setCreateGroupPopupOpen(true)}
        >
          <UsersIcon
            size={24}
            color="#ffffff"
            weight="fill"
            className="group-hover:scale-110 transition"
          />
        </button>


        <button
          className="group flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#22283a] transition"
          onClick={() => setUserProfilePopupOpen(true)}>
          <CircleUserRound
            size={24}
            color="#ffffff"
            weight="fill"
            className="group-hover:scale-110 transition"/>
        </button>

      </div>

      {/* BOTTOM ICON */}
      <button
        className="group flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-500/20 transition"
        onClick={() => setLogoutPopupOpen(true)}>
        <SignOutIcon
          size={24}
          color="#ffffff"
          weight="fill"
          className="group-hover:scale-110 transition"/>
      </button>

    </div>
  )
}

export default LeftMostBar
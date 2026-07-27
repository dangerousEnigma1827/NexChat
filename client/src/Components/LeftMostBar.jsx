import React from 'react'
import { ChatCircleTextIcon, SignOutIcon, UsersIcon } from "@phosphor-icons/react"
import { CircleUserRound } from 'lucide-react'
import * as Tooltip from "@radix-ui/react-tooltip"

function LeftMostBar({
  setLogoutPopupOpen,
  setCreateGroupPopupOpen,
  setUserProfilePopupOpen,
  active,
  setActive
}) {


  const buttonClass = (name) => `
    group relative flex items-center justify-center 
    w-10 h-10 rounded-lg transition
    ${active === name 
      ? "bg-[#22283a]" 
      : "hover:bg-[#22283a]"
    }
  `


  const ActiveIndicator = ({ name }) => (
    active === name && (
      <div
        className="
          absolute -left-3 top-1/2 -translate-y-1/2
          h-8 w-1 rounded-r-full
          bg-[#4c7dff]
        "
      />
    )
  )


  const tooltipClass = `
    bg-[#1a1f2e]
    text-white
    text-xs
    px-3
    py-1.5
    rounded-md
    shadow-lg
    border border-[#2a3142]
  `



  return (

    <Tooltip.Provider delayDuration={300}>

      <div
        className="
          w-[70px] h-full
          bg-[#141720]
          flex flex-col
          items-center
          justify-between
          py-6
          border-r border-[#1d2230]
        "
      >


        {/* TOP ICONS */}

        <div className="flex flex-col gap-6">


          {/* Chats */}

          <Tooltip.Root>

            <Tooltip.Trigger asChild>

              <button
                onClick={() => setActive("chats")}
                className={buttonClass("chats")}
              >

                <ActiveIndicator name="chats"/>


                <ChatCircleTextIcon
                  size={24}
                  color="#ffffff"
                  weight="fill"
                  className="group-hover:scale-110 transition"
                />

              </button>

            </Tooltip.Trigger>


            <Tooltip.Content
              side="right"
              sideOffset={8}
              className={tooltipClass}
            >

              Chats

              <Tooltip.Arrow className="fill-[#1a1f2e]" />

            </Tooltip.Content>

          </Tooltip.Root>






          {/* Groups */}

          <Tooltip.Root>

            <Tooltip.Trigger asChild>

              <button
                onClick={() => {
                  setActive("groups")
                  setCreateGroupPopupOpen(true)
                }}
                className={buttonClass("groups")}
              >

                <ActiveIndicator name="groups"/>


                <UsersIcon
                  size={24}
                  color="#ffffff"
                  weight="fill"
                  className="group-hover:scale-110 transition"
                />

              </button>

            </Tooltip.Trigger>


            <Tooltip.Content
              side="right"
              sideOffset={8}
              className={tooltipClass}
            >

              Create Group

              <Tooltip.Arrow className="fill-[#1a1f2e]" />

            </Tooltip.Content>


          </Tooltip.Root>







          {/* Profile */}

          <Tooltip.Root>

            <Tooltip.Trigger asChild>


              <button
                onClick={() => {
                  setActive("profile")
                  setUserProfilePopupOpen(true)
                }}
                className={buttonClass("profile")}
              >

                <ActiveIndicator name="profile"/>


                <CircleUserRound
                  size={24}
                  color="#ffffff"
                  className="group-hover:scale-110 transition"
                />

              </button>


            </Tooltip.Trigger>


            <Tooltip.Content
              side="right"
              sideOffset={8}
              className={tooltipClass}
            >

              Profile

              <Tooltip.Arrow className="fill-[#1a1f2e]" />

            </Tooltip.Content>


          </Tooltip.Root>


        </div>







        {/* Logout */}

        <Tooltip.Root>

          <Tooltip.Trigger asChild>


            <button
              onClick={() => setLogoutPopupOpen(true)}
              className="
                group flex items-center justify-center
                w-10 h-10 rounded-lg
                hover:bg-red-500/20
                transition
              "
            >

              <SignOutIcon
                size={24}
                color="#ffffff"
                weight="fill"
                className="
                  group-hover:scale-110
                  transition
                "
              />

            </button>


          </Tooltip.Trigger>


          <Tooltip.Content
            side="right"
            sideOffset={8}
            className={tooltipClass}
          >

            Logout

            <Tooltip.Arrow className="fill-[#1a1f2e]" />

          </Tooltip.Content>


        </Tooltip.Root>


      </div>


    </Tooltip.Provider>

  )
}


export default LeftMostBar
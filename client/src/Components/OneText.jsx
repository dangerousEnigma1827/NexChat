import React from 'react'

function OneText({ text, isEdited, isDeletedForEveryone, createdAt, isMine, hasAttachments }) {
  return (
    <div className={`px-2 min-w-[80px] ${hasAttachments ? "max-w-[300px]" : "max-w-[370px]"}`}>
      <p className={`text-[14.5px] ${isDeletedForEveryone ? "text-gray-300 italic px-1 py-01" : "text-white"} max-w-full`}>
        {!isDeletedForEveryone && text}
        {isDeletedForEveryone &&
          (isMine ? "You Deleted This Message" : "This Message Was Deleted")
        }
      </p>
      <div className="flex justify-end items-center gap-1.5">
        {isEdited && !isDeletedForEveryone && (
          <span className="text-[10px] text-white/50 ml-10">Edited</span>
        )}
        {/* <span className="text-[10px] text-white/50">
          {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span> */}
      </div>
    </div>
  )
}

export default OneText
// OneText.jsx
import React from 'react'

function OneText({ text, isEdited, isDeletedForEveryone, createdAt, isMine, hasAttachments }) {
  return (
    <div className={`px-3 pt-2 pb-1 min-w-[80px] ${hasAttachments ? "max-w-[320px]" : "max-w-[370px]"}`}>
      <p className={`text-[14.5px] leading-relaxed ${isDeletedForEveryone ? "text-gray-300 italic" : "text-white"} max-w-full`}>
        {!isDeletedForEveryone && text}
        {isDeletedForEveryone &&
          (isMine ? "You deleted this message" : "This message was deleted")
        }
      </p>
      {isEdited && !isDeletedForEveryone && (
        <div className="flex justify-end mt-0.5">
          <span className="text-[10px] text-white/50">Edited</span>
        </div>
      )}
    </div>
  )
}

export default OneText
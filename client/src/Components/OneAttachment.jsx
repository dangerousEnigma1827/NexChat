// OneAttachment.jsx
import React from 'react'

function OneAttachment({message, dropdownref, attachment, dropArrowdownId, setDropArrowdownId, setMessageToDelete, setAttachmentUrlForDeletion, setDeletePopupOpen, currentUserId, setImagePreviewOpen, setPreviewSrc, scrollRef}) {
  const isMine = message.senderId._id === currentUserId
  const isOpen = dropArrowdownId === attachment.url

  return (
    <div className="relative group/attachment" ref={dropdownref}>
      <button
        onClick={() => {
          setDropArrowdownId(isOpen ? null : attachment.url)
          setMessageToDelete(message._id)
          setAttachmentUrlForDeletion(attachment.url)
        }}
        className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/attachment:opacity-100 hover:opacity-100 bg-[#232a3a] rounded-full p-1 transition-all duration-200 z-20 ${
          isMine ? "-left-7" : "-right-7"
        }`}
      >
        <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
          isMine ? "-left-48" : "-right-48"
        }`}>
          <div className="p-1.5 text-sm text-gray-300 font-medium">
            {isMine && (
              <button
                className="inline-flex items-center w-full px-3 py-2 hover:bg-[#2b3142] hover:text-white rounded transition-all"
                onClick={() => setDeletePopupOpen(true)}
              >
                Delete For All
              </button>
            )}
            <button
              className="inline-flex items-center w-full px-3 py-2 hover:bg-[#2b3142] hover:text-white rounded transition-all"
              onClick={() => setDeletePopupOpen(true)}
            >
              Delete For Me
            </button>
          </div>
        </div>
      )}

      {attachment.type === "image" && !attachment.isDeletedForEveryone && (
        <img
          src={attachment.url}
          alt="chat-image"
          className="cursor-pointer block w-full max-h-[380px] object-cover"
          loading="lazy"
          onLoad={() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }}
          onClick={() => {
            setPreviewSrc(attachment.url)
            setImagePreviewOpen(true)
          }}
        />
      )}
    </div>
  )
}

export default OneAttachment
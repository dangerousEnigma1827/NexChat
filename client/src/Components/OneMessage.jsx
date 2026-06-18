// import React from 'react'
// import OneAttachment from './OneAttachment'
// import OneText from './OneText'

// function OneMessage({
//   message,
//   currentUserId,
//   dropArrowdownId,
//   setDropArrowdownId,
//   setMessageToDelete,
//   setAttachmentUrlForDeletion,
//   dropdownref,
//   setDeletePopupOpen,
//   setEditPopupOpen,
//   setMessageToDeleteTime,
//   setMessageToDeleteText,
//   isconversationAGroup
// }) {

//   const isMine = message.senderId?._id === currentUserId

//   return (
//     <div className={`flex w-full px-2 py-1 ${isMine ? "justify-end" : "justify-start"}`}>

//       <div className={`flex flex-col max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>

//         {/* sender info (only for group + others) */}
//         {isconversationAGroup && !isMine && (
//           <div className="flex items-center gap-2 mb-1 ml-1">
//             <img
//               src={message.senderId?.pfp}
//               alt="pfp"
//               className="w-6 h-6 rounded-full object-cover"
//             />
//             <p className="text-xs text-gray-500">
//               {message.senderId?.username}
//             </p>
//           </div>
//         )}

//         {/* MESSAGE BUBBLE */}
//         <div
          
//         >

//           {/* attachments */}
//           {message.attachments?.length > 0 && (
//             <div className="flex flex-col gap-2 mb-2">
//               {message.attachments.map((attachment, index) => (
//                 <OneAttachment
//                   key={index}
//                   message={message}
//                   attachment={attachment}
//                   index={index}
//                   dropdownref={dropdownref}
//                   dropArrowdownId={dropArrowdownId}
//                   setDropArrowdownId={setDropArrowdownId}
//                   setAttachmentUrlForDeletion={setAttachmentUrlForDeletion}
//                   setDeletePopupOpen={setDeletePopupOpen}
//                   currentUserId={currentUserId}
//                   setMessageToDelete={setMessageToDelete}
//                 />
//               ))}
//             </div>
//           )}

//           {/* text */}
//           {message.text && (
//             <OneText
//               message={message}
//               dropdownref={dropdownref}
//               dropArrowdownId={dropArrowdownId}
//               setDropArrowdownId={setDropArrowdownId}
//               setAttachmentUrlForDeletion={setAttachmentUrlForDeletion}
//               setDeletePopupOpen={setDeletePopupOpen}
//               currentUserId={currentUserId}
//               setMessageToDelete={setMessageToDelete}
//               setEditPopupOpen={setEditPopupOpen}
//               setMessageToDeleteText={setMessageToDeleteText}
//               setMessageToDeleteTime={setMessageToDeleteTime}
//             />
//           )}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default OneMessage















import React from 'react'
import OneAttachment from './OneAttachment'
import OneText from './OneText'

function OneMessage({
  message,
  currentUserId,
  dropArrowdownId,
  setDropArrowdownId,
  setMessageToDelete,
  setAttachmentUrlForDeletion,
  dropdownref,
  setDeletePopupOpen,
  setEditPopupOpen,
  setMessageToDeleteTime,
  setMessageToDeleteText,
  isconversationAGroup
}) {

  const isMine = message.senderId === currentUserId || message.senderId?._id === currentUserId

  return (
    <div className={`flex w-full px-4 py-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>

        {/* Group sender info */}
        {isconversationAGroup && !isMine && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            {message.senderId?.pfp
              ? <img src={message.senderId.pfp} className="w-5 h-5 rounded-full object-cover" />
              : <div className="w-5 h-5 rounded-full bg-[#2a3142]" />
            }
            <p className="text-[11px] text-gray-500 font-medium">{message.senderId?.username}</p>
          </div>
        )}

        {/* Single bubble wrapping everything */}
        <div className={`relative group rounded-2xl overflow-visible
          ${isMine
            ? "bg-[#4c7dff] text-white rounded-tr-sm"
            : "bg-[#1d2235] text-white rounded-tl-sm"
          }`}
        >
          {/* Dropdown trigger button */}
          <button
            onClick={() => {
              setDropArrowdownId(dropArrowdownId ? null : message._id)
              setMessageToDelete(message._id)
              setAttachmentUrlForDeletion("")
            }}
            className={`absolute top-1/2 -translate-y-1/2 opacity-0
              ${!message.isDeletedForEveryone ? "group-hover:opacity-100" : ""}
              bg-[#1a1f2e] hover:bg-[#232a3a] rounded-full p-1 transition-all duration-150 z-20
              ${isMine ? "-left-7" : "-right-7"}`}
          >
            <svg className="w-3.5 h-3.5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropArrowdownId === message._id && (
            <div ref={dropdownref} className={`absolute top-1/2 -translate-y-1/2 z-30
              bg-[#1a1f2e] border border-[#2a3142] rounded-xl shadow-2xl w-44 overflow-hidden
              ${isMine ? "-left-48" : "-right-48"}`}
            >
              {isMine && (
                <button
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#232a3a] hover:text-white transition-colors"
                  onClick={() => {
                    setEditPopupOpen(true)
                    setMessageToDeleteText(message.text)
                    setMessageToDeleteTime(message.createdAt)
                  }}
                >
                  Edit
                </button>
              )}
              {isMine && (
                <button
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-[#232a3a] hover:text-red-300 transition-colors"
                  onClick={() => setDeletePopupOpen(true)}
                >
                  Delete for everyone
                </button>
              )}
              <button
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-400 hover:bg-[#232a3a] hover:text-white transition-colors"
                onClick={() => setDeletePopupOpen(true)}
              >
                Delete for me
              </button>
            </div>
          )}

          {/* Attachments */}
          {message.attachments?.length > 0 && (
            <div className="flex flex-col gap-1">
              {message.attachments.map((attachment, index) => (
                <OneAttachment
                  key={index}
                  attachment={attachment}
                  isDeletedForEveryone={attachment.isDeletedForEveryone}
                />
              ))}
            </div>
          )}

          {/* Text */}
          {message.text && (
            <OneText
              text={message.text}
              isEdited={message.isEdited}
              isDeletedForEveryone={message.isDeletedForEveryone}
              createdAt={message.createdAt}
              isMine={isMine}
              hasAttachments={message.attachments?.length > 0}
            />
          )}

        </div>
      </div>
    </div>
  )
}

export default OneMessage
// import React from 'react'

// function OneText({message ,dropArrowdownId, setDropArrowdownId, setMessageToDelete, setAttachmentUrlForDeletion, currentUserId, dropdownref, setDeletePopupOpen, setEditPopupOpen, setMessageToDeleteText, setMessageToDeleteTime}) {
//   return (
//     <>
//     <div className={`w-full flex mb-1 ${ message.senderId === currentUserId? "justify-end": "justify-start"}`}>
//         <div className={`group relative overflow-visible max-w-[100%] px-4 py-3 text-white break-words ${
//             message.senderId === currentUserId ? "bg-blue-500 mr-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl": "bg-[#1d202f] ml-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"}`}>

//             <div ref={dropdownref}>
//                 <button
//                     onClick={() =>  {
//                         if(dropArrowdownId == null) setDropArrowdownId(message._id)
//                         else setDropArrowdownId(null)

//                         setMessageToDelete(message._id)
//                         setAttachmentUrlForDeletion("")
//                     }}
//                     className={`absolute top-1/2 -translate-y-1/2 opacity-0 ${message.isDeletedForEveryone == false ? "group-hover:opacity-100 hover:opacity-100" : "opacity-0"} bg-[#232a3a] rounded-full p-1 transition-all duration-200 z-20 ${
//                         message.senderId === currentUserId
//                         ? "-left-6"
//                         : "-right-6"
//                     }`}>
//                     <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
//                 </button>
//                 {
//                     dropArrowdownId == message._id && message.senderId == currentUserId  &&(
//                         <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
//                             message.senderId === currentUserId
//                             ? "-left-56"
//                             : "-right-56"
//                         }`}>
//                             <div className="p-2 text-sm text-gray-300 font-medium">
//                                 <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
//                                     setEditPopupOpen(true)
//                                     setMessageToDeleteText(message.text)
//                                     setMessageToDeleteTime(message.createdAt)
//                                 }}>Edit</button>
//                             </div>
//                             <div class="p-2 text-sm text-body font-medium">
//                                 <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
//                                     setDeletePopupOpen(true)
//                                 }}>Delete For All</button>

//                                 {/* udner work */}
//                                 <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all">Delete For Me</button>
//                             </div>
//                         </div>
//                     )
//                 }

//                 {/* not current users message to can only delete for me */}
//                 {
//                     dropArrowdownId == message._id && message.senderId != currentUserId && (
//                         <div className={`absolute top-1/2 -translate-y-1/2 z-10 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
//                             message.senderId === currentUserId
//                             ? "-left-56"
//                             : "-right-56"
//                         }`}>
//                             <div className="p-2 text-sm text-gray-300 font-medium">
//                                 <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
//                                     setDeletePopupOpen(true)
//                                 }}>Delete For Me</button>
//                             </div>
//                         </div>
//                     )
//                 }
//             </div>

//             <p className={`text-[15px] leading-relaxed ${message.isDeletedForEveryone? "text-gray-300 italic opacity-70": "text-white"}`}>
//                 {message.text}
//             </p>

//             <div className='flex justify-end mt-1 gap-2'>
//                 <span className='text-[11px] text-gray-300 font-light'>
//                     {
//                         (message.isEdited && !message.isDeletedForEveryone )? "Edited" : ""
//                     }
//                 </span>
//                 <span className='text-[11px] text-gray-300 font-light'>
//                     {
//                         new Date(message.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit"
//                         })
//                     }
//                 </span>
                
//             </div>

//         </div>
//     </div>
//     </>
//   )
// }

// export default OneText











import React from 'react'

function OneText({ text, isEdited, isDeletedForEveryone, createdAt, isMine, hasAttachments }) {
  return (
    <div className={`px-2 min-w-[80px] ${hasAttachments ? "max-w-[300px]" : "max-w-[370px]"}`}>
      <p className={`text-[14.5px] ${isDeletedForEveryone ? "text-gray-400 italic px-1 py-01" : "text-white"} max-w-full`}>
        {text}
      </p>
      <div className="flex justify-end items-center gap-1.5">
        {isEdited && !isDeletedForEveryone && (
          <span className="text-[10px] text-white/50">Edited</span>
        )}
        {/* <span className="text-[10px] text-white/50">
          {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span> */}
      </div>
    </div>
  )
}

export default OneText
import React from 'react'

function OneAttachment({message, dropdownref, attachment, dropArrowdownId, setDropArrowdownId, setMessageToDelete, setAttachmentUrlForDeletion, setDeletePopupOpen, currentUserId, index}) {
    const isImageAttachment = attachment.type === "image" && !attachment.isDeletedForEveryone

  return (
    <>
    <div key={index} className={`w-full flex mb- ${message.senderId._id === currentUserId? "justify-end": "justify-start"}`} ref={dropdownref}>
        <div className={`group relative overflow-hidden max-w-[65%] sm:max-w-[320px] ${
            message.senderId._id === currentUserId
            ? "bg-blue-500 mr-1 ml-1 mt-1 "
            : "bg-[#1d202f] mr-1 ml-1 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
        }`}>

            <div >
                <button 
                    onClick={() => {
                        if(dropArrowdownId == null){
                            setDropArrowdownId(attachment.url)
                            console.log("set")
                        }
                        else setDropArrowdownId(null)

                        setMessageToDelete(message._id)
                        setAttachmentUrlForDeletion(attachment.url)
                    }}
                    className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-[#232a3a] rounded-full p-1 transition-all duration-200 z-20 ${
                        message.senderId._id === currentUserId
                        ? "-left-6"
                        : "-right-6"
                    }`}>
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                    </svg>
                </button>

                {
                    dropArrowdownId == attachment.url && message.senderId._id == currentUserId && (
                        <div className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${message.senderId._id === currentUserId? "-left-56": "-right-56"}`}>
                            <div className="p-2 text-sm text-gray-300 font-medium">
                                <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] text-white rounded transition-all" onClick={(e)=>{
                                    setDeletePopupOpen(true)
                                }}>Delete For All</button>
                                <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] text-white rounded transition-all" onClick={(e)=>{
                                    console.log("1")
                                    setDeletePopupOpen(true)
                                }}>Delete For Me</button>
                            </div>
                        </div>
                    )
                }
                {
                    dropArrowdownId == attachment.url && message.senderId._id != currentUserId && (
                        <div className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#232a3a] border border-[#31384d] rounded-md divide-y divide-[#31384d] shadow-lg w-44 ${
                            message.senderId.Id === currentUserId
                            ? "-left-56"
                            : "-right-56"
                        }`}>
                            <div className="p-2 text-sm text-gray-300 font-medium">
                                <button className="inline-flex items-center w-full p-2 hover:bg-[#2b3142] hover:text-white rounded transition-all" onClick={(e)=>{
                                    setDeletePopupOpen(true)
                                }}>Delete For Me</button>
                            </div>
                        </div>
                    )
                }

            </div>


            {/* for image only currently */}
            {
                attachment.type == "image" && !attachment.isDeletedForEveryone && (
                    <img
                        src={attachment.url}
                        alt="chat-image"
                        className='cursor-pointer block w-full max-h-[380px] object-cover rounded-xl bg-blue-500'
                        loading="lazy"
                    />
                )
            }
            {/* {
                attachment.type == "image" && attachment.isDeletedForEveryone && (
                    <p className={`text-[15px] leading-relaxed text-gray-300 italic opacity-70 p-1`}>
                    This Message Was Deleted
                    </p>
                )
            } */}

            {/* <div className={`flex justify-end ${isImageAttachment ? "absolute bottom-1 right-2" : "mt-1"}`}>
                <span className={`text-[11px] font-light ${isImageAttachment ? "text-white/90 bg-black/40 px-1.5 py-0.5 rounded-full" : "text-gray-300"}`}>
                    {
                        new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }
                </span>
            </div> */}

            

        </div>
    </div>
    </>
  )
}

export default OneAttachment
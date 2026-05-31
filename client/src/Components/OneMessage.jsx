import React from 'react'
import OneAttachment from './OneAttachment'
import OneText from './OneText'

function OneMessage({message, currentUserId, dropArrowdownId, setDropArrowdownId, setMessageToDelete, setAttachmentUrlForDeletion, dropdownref, setDeletePopupOpen}) {
  return (
    <>
    <div key={message._id}>
        {
            message.attachments?.length != 0 && (
                message.attachments?.map((attachment, index)=>{
                    return (
                        <OneAttachment message={message} dropdownref={dropdownref} dropArrowdownId={dropArrowdownId} setDropArrowdownId={setDropArrowdownId} setAttachmentUrlForDeletion={setAttachmentUrlForDeletion} setDeletePopupOpen={setDeletePopupOpen} currentUserId={currentUserId} setMessageToDelete={setMessageToDelete} attachment={attachment} index={index}/>
                    )
                })
            )
        }
        { message.text != "" && 
            <OneText message={message} dropdownref={dropdownref} dropArrowdownId={dropArrowdownId} setDropArrowdownId={setDropArrowdownId} setAttachmentUrlForDeletion={setAttachmentUrlForDeletion} setDeletePopupOpen={setDeletePopupOpen} currentUserId={currentUserId} setMessageToDelete={setMessageToDelete}/>
        }
        </div>
    </>
  )
}

export default OneMessage
import React, { useEffect, useState } from "react";
import { X,Users } from "lucide-react";
import { getCommonGroups } from "../Services/groupServices";

function SideOverlay({ setIsSideBarOpen, userA, userB , conversationSelectedUsername, conversationSelectedPfp, onlineUsers, conversationSelected, isconversationAGroup}) {

  const [commonGroups, setCommonGroups] = useState([]);

  const handleFindCommonGroups = async () => {
    try {
      const res = await getCommonGroups(userA, userB);
      setCommonGroups(res);
      console.log(res)
    } catch (err) {
      console.log("error finding common groups ", err)
    }
  };

  useEffect(() => {
    if (userA && userB) {
      handleFindCommonGroups();
    }
  }, [userA, userB]);

  return (
    <>
    {!isconversationAGroup && <div className="h-full w-full bg-[#212634] text-white relative">

      <div className="flex items-center gap-3 h-[10vh] px-4 border-b border-[#2a3040] bg-[#212634]">
        <X
          className="hover:bg-[#2b3142] rounded-full p-2 cursor-pointer transition"
          size={36}
          onClick={() => setIsSideBarOpen(false)}
        />
        <p className="text-lg font-semibold">User Info</p>
      </div>

      <div className="p-6 flex flex-col items-center bg-[#212634] min-h-[90vh]">

        <img
          src={conversationSelectedPfp}
          className="w-28 h-28 rounded-full border-4 border-[#2b3142] object-cover"
        />

        <h2 className="mt-4 text-xl font-semibold">{conversationSelectedUsername}</h2>
        <p className="text-gray-400 text-sm">{onlineUsers?.includes(conversationSelected) ? "Online" : "Offline"}</p>

        <div className="w-full mt-8">
          <h3 className="font-semibold mb-3">Common Groups</h3>
          <div className="space-y-2">
            {commonGroups.length === 0 && (
              <p className="text-gray-500 text-sm">
                No common groups found
              </p>
            )}

            <div className='w-[100%] mt-1 flex flex-col items-center overflow-y-auto'>
              <div className='w-[100%] mt-1 flex flex-col items-center overflow-y-auto'>
              {commonGroups.map((conversation) => (
                <div
                  key={conversation._id}
                  className='h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all'
                  onClick={() => {
                    // setConversationId(conversation._id);
                    // setConversationSelected(conversation._id);
                    // setConversationSelectedtedUsername(conversation.groupName);
                    // setConversationSelectedtedPfp(conversation.groupIcon);
                    // setIsConversationAGroup(true);
                    // setGroupMembers(conversation.participants);
                    // setGroupAdmins(conversation.groupAdmin || conversation.admins);
                  }}>

                  <div className='flex items-center gap-4 w-full'>

                    <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center overflow-hidden'>
                      {conversation.groupIcon ? (
                        <img src={conversation.groupIcon} className='h-full w-full object-cover rounded-full'/>) : (<p className='text-white text-md font-medium'>{conversation.groupName?.substring(0, 1).toUpperCase()}</p>)}
                    </div>

                    <div className='flex flex-col min-w-0 flex-1'>
                      <p className='text-white text-lg font-medium truncate'>{conversation.groupName}</p>
                      <p className='text-sm text-gray-400 truncate'>{conversation.participants.map((p) => p.username).join(", ")}</p>
                    </div>

                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>}
    {isconversationAGroup && <div className="h-full w-full bg-[#212634] text-white relative">

      <div className="flex items-center gap-3 h-[10vh] px-4 border-b border-[#2a3040] bg-[#212634]">
        <X
          className="hover:bg-[#2b3142] rounded-full p-2 cursor-pointer transition"
          size={36}
          onClick={() => setIsSideBarOpen(false)}
        />
        <p className="text-lg font-semibold">User Info</p>
      </div>

      <div className="p-6 flex flex-col items-center bg-[#212634] min-h-[90vh]">

        <img
          src={conversationSelectedPfp}
          className="w-28 h-28 rounded-full border-4 border-[#2b3142] object-cover"
        />

        <h2 className="mt-4 text-xl font-semibold">{conversationSelectedUsername}</h2>
        <p className="text-gray-400 text-sm">{onlineUsers?.includes(conversationSelected) ? "Online" : "Offline"}</p>

        <div className="w-full mt-8">
          <h3 className="font-semibold mb-3">Common Groups</h3>
          <div className="space-y-2">
            {commonGroups.length === 0 && (
              <p className="text-gray-500 text-sm">
                No common groups found
              </p>
            )}

            <div className='w-[100%] mt-1 flex flex-col items-center overflow-y-auto'>
              <div className='w-[100%] mt-1 flex flex-col items-center overflow-y-auto'>
              {commonGroups.map((conversation) => (
                <div
                  key={conversation._id}
                  className='h-[7vh] w-[100%] flex items-center justify-between mb-3 gap-2 cursor-pointer hover:bg-[#2b3142] rounded-md px-2 py-8 duration-500 transition-all'
                  onClick={() => {
                    // setConversationId(conversation._id);
                    // setConversationSelected(conversation._id);
                    // setConversationSelectedtedUsername(conversation.groupName);
                    // setConversationSelectedtedPfp(conversation.groupIcon);
                    // setIsConversationAGroup(true);
                    // setGroupMembers(conversation.participants);
                    // setGroupAdmins(conversation.groupAdmin || conversation.admins);
                  }}>

                  <div className='flex items-center gap-4 w-full'>

                    <div className='rounded-full bg-[#141720] h-[7vh] w-[7vh] flex justify-center items-center overflow-hidden'>
                      {conversation.groupIcon ? (
                        <img src={conversation.groupIcon} className='h-full w-full object-cover rounded-full'/>) : (<p className='text-white text-md font-medium'>{conversation.groupName?.substring(0, 1).toUpperCase()}</p>)}
                    </div>

                    <div className='flex flex-col min-w-0 flex-1'>
                      <p className='text-white text-lg font-medium truncate'>{conversation.groupName}</p>
                      <p className='text-sm text-gray-400 truncate'>{conversation.participants.map((p) => p.username).join(", ")}</p>
                    </div>

                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>}
    </>
  );
}

export default SideOverlay;
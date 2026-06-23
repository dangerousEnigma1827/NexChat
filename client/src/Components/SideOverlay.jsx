import React, { useContext, useEffect, useState } from "react";
import { X, UsersRound, UserRound, Mail, Link, Shield, UserCheck, FileText } from "lucide-react";
import { getCommonGroups } from "../Services/groupServices";
import { GroupContext } from "../context/groupContext";
import { ConversationContext } from "../context/conversationContext";
import api from "../api/apiInstance";

function SideOverlay({
  setIsSideBarOpen,
  userA,
  userB,
  onlineUsers,
  setUserSelectedIdIfNotGroup
}) {

  const [commonGroups, setCommonGroups] = useState([]);
  let [conversationClicked, setConversationClicked] = useState(null)
  let token = localStorage.getItem('token')

  let {groupMembers,groupAdmins} = useContext(GroupContext)
  let {
        conversations,
        conversationId,
        setConversationId,
        isconversationAGroup,
        setIsConversationAGroup,
        setConversations,
        conversationSelected,
        setConversationSelected,
        conversationSelectedUsername,
        setConversationSelectedtedUsername,
        conversationSelectedDescription,
        setConversationSelectedDescription,
        conversationSelectedPfp,
        setConversationSelectedtedPfp,
        conversationSelectedtedAbout
    } = useContext(ConversationContext);

  const handleFindCommonGroups = async () => {
    try {
      const res = await getCommonGroups(userA, userB);
      setCommonGroups(res);
    } catch (err) {
      console.log("error finding common groups", err);
    }
  };

  const getConversation = async (clickedMemberId)=>{
    try{
        let res = await api.get(`/conversations/getClickedUserConversation/${userB}/${clickedMemberId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log(res.data)

        setConversationClicked(res.data[0]._id)
        setConversationSelected(res.data[0]._id)
        setConversationId(res.data[0]._id)
        
        
        // console.log(res.data[0]._id)
    }catch(err){
        console.log("error getting clicked conversation ",err  )
    }
  }

  useEffect(() => {
    if (userA && userB) handleFindCommonGroups();
  }, [userA, userB]);

  const isOnline = onlineUsers?.includes(isconversationAGroup ? conversationSelected : userB);

  const SectionLabel = ({ label }) => (
    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">{label}</p>
  );

  return (
    <div className="h-full w-full bg-[#212634] text-white flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[10vh] border-b border-[#2a3040] flex-shrink-0">
        <p className="text-[16px] font-semibold text-white">
          {isconversationAGroup ? "Group Info" : "User Info"}
        </p>
        <button
          onClick={() => setIsSideBarOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2b3142] transition-colors">
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        <div className="flex flex-col items-center pt-8 pb-6 px-5 border-b border-[#2a3040]">
          <div className="relative mb-4">

          {conversationSelectedPfp ? 
            <img src={conversationSelectedPfp} className="w-20 h-20 rounded-full object-cover ring-2 ring-[#2a3142]" />
            : 
            <div className="w-20 h-20 rounded-full bg-[#1d2235] flex items-center justify-center ring-2 ring-[#2a3142]">
              {isconversationAGroup
                ? <UsersRound size={32} className="text-gray-400" />
                : <UserRound/>
              }
            </div>
          }

            {!isconversationAGroup ? <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#212634] ${isOnline ? "bg-emerald-400" : "bg-gray-600"}`} /> : ""}
          </div>

          <h2 className="text-[17px] font-semibold text-white leading-tight">
            {conversationSelectedUsername}
          </h2>

          {!isconversationAGroup ? <span className={`text-xs font-medium px-2.5 rounded-full ${
            isOnline ? " text-emerald-400" : " text-gray-500"
          }`}>
            {isOnline ? "Online" : "Offline"}
          </span> : ""}

          {isconversationAGroup && groupMembers && (
            <p className="text-sm text-gray-500 mt-1">Group</p>)}
        </div>

        <div className="p-4 space-y-5">

          {/* Username row (private only) */}
          {!isconversationAGroup && (
            <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">
              <div className="bg-[#1b1f30] rounded-xl border border-[#1d2230] p-3">
              <SectionLabel label={"Username"} />
                <div className="flex items-center gap-3 px-1 py-1">

                  <div className="min-w-0">
                    <p className="text-[13px] text-white truncate">{conversationSelectedUsername}</p>
                  </div>

                </div>
              </div>
            </div>
          )}


          {/* {!isconversationAGroup && (
            <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">
              <div className="bg-[#1b1f30] rounded-xl border border-[#1d2230] p-3">
              <SectionLabel label={"ABOUT"} />
                <div className="flex items-center gap-3 px-1 py-1">

                  <div className="min-w-0">
                    <p className="text-[13px] text-white truncate">{conversationSelectedtedAbout}</p>
                  </div>

                </div>
              </div>
            </div>
          )} */}

          {isconversationAGroup && (
            <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">
              <div className="bg-[#1b1f30] rounded-xl border border-[#1d2230] p-3">
              <SectionLabel label={"Group Description"} />
                <div className="flex items-center gap-3 px-1 py-1">
                  <div className="min-w-0">
                    <p className="text-[13px] text-white truncate">{conversationSelectedDescription || "No Group Description"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

       
          {/* Members (group only) */}
          {isconversationAGroup && (
            <div className="mt-4 flex flex-col flex-1 overflow-y-auto space-y-2 ">
              <div className="bg-[#1b1f30] rounded-xl border border-[#1d2230] p-3">
              <SectionLabel label={`Members -  ${groupMembers?.length ?? 0}`} />
                {groupMembers.map((conversation, index) => {

                let isAdmin = false;
                groupAdmins.forEach((admin, index)=>{
                  if(conversation._id == admin._id) isAdmin = true; 
                })

                return (
                  <div
                    key={index}
                    className={`
                      group flex items-center gap-1 px-3 py-3 rounded-xl cursor-pointer
                      transition-all duration-200
                      hover:bg-[#22283a]`}
                      onClick={(e)=>{
                        if(conversation._id != userB){
                            getConversation(conversation._id)
                            setIsConversationAGroup(false)
                            setUserSelectedIdIfNotGroup(conversation._id)
                            setConversationSelectedtedUsername(conversation.username)
                            setConversationSelectedtedPfp(conversation.pfp)
                            setIsSideBarOpen(true)
                        }
                      }}
                      >

                    {/* AVATAR */}
                  <div className="relative flex-shrink-0">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center ring-1 ring-[#2a3142] group-hover:ring-[#4c7dff]/40 transition">

                      {
                        conversation?.pfp ? (
                          <img src={conversation.pfp} className="h-full w-full object-cover" />
                        ) : (
                          <UserRound className="text-white" />
                        )
                      }

                    </div>
                    {conversation.type === "private" &&
                      onlineUsers.includes(conversation._id) && (
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#0f111a]" />
                      )}
                  </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-white font-medium truncate">
                          {conversation._id == userB ? conversation?.username + " (You)" : conversation?.username}
                        </p>
                        <p className="text-emerald-400 font-medium truncate">
                          {isAdmin ? "Admin" : ""}
                        </p>

                      </div>
                    </div>
                  </div>
                )
                })}
              </div>
            </div>
          )}

          {/* Common groups (private only) */}
          {(isconversationAGroup==false && commonGroups.length != 0)  &&  (
            <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">
              <div className="bg-[#1b1f30] rounded-xl border border-[#1d2230] p-3">
              <SectionLabel label="Common Groups" />
                {commonGroups?.map((group, index) => {
                  return (
                    <div
                      key={index}
                      className={`
                        group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                        transition-all duration-200
                        hover:bg-[#1a1f2e]
                      `} onClick={(e)=>{
                            setUserSelectedIdIfNotGroup(null)
                            setConversationSelected(group._id)
                            setConversationId(group._id)

                            setIsConversationAGroup(true)
                            setConversationSelectedtedUsername(group.groupName)
                            setConversationSelectedDescription(group.groupDescription)
                            setConversationSelectedtedPfp(group.groupIcon)
                            setGroupMembers(group.participants)
                            setGroupAdmins(group.groupAdmin)
                            setIsSideBarOpen(true)
                      }}>
                      <div className="relative flex-shrink-0">
                        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center ring-1 ring-[#2a3142] group-hover:ring-[#4c7dff]/40 transition">
                          {
                            group.groupIcon? (
                              <img src={group.groupIcon} className="h-full w-full object-cover" />
                            ) : (
                              <UsersRound className="text-white" />
                            )
                          }
                        </div>
        
                      </div>
        
                      <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-white font-medium truncate">
                              {group.groupName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {group.participants.map(p => p.username).join(", ")}
                            </p>
                      </div>
        
                    </div>
                  )
                })}
              </div>
            </div>
          )
          }


          {(isconversationAGroup==false && commonGroups.length == 0)  &&  (
            (
            <div className="mt-4 flex flex-col flex-1 overflow-y-auto pr-1 space-y-2">
              <div className="bg-[#1b1f30] rounded-xl border border-[#1d2230] p-3">
              <SectionLabel label="Common Groups" />
                <div className="w-full flex justify-center items-center">
                  <p className="align-center text-gray-300">No Common Groups Found!</p>
                </div>
              </div>
            </div>
          )
          )
          }

        

        </div>
      </div>
    </div>
  );
}

export default SideOverlay;
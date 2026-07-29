import React, { useContext, useEffect, useState } from "react";
import { X, UsersRound, UserRound, Mail, Link, Shield, UserCheck, FileText, ChevronRight, Trash2, BellOff, Ban, Flag } from "lucide-react";
import { getCommonGroups } from "../Services/groupServices";
import { GroupContext } from "../context/groupContext";
import { ConversationContext } from "../context/conversationContext";
import api from "../api/apiInstance";

function SideOverlay({
  setIsSideBarOpen,
  userA,
  userB,
  onlineUsers,
  setUserSelectedIdIfNotGroup,
  setClearChatPopupOpen,
  onClearChat = () => {},
  onMuteToggle = () => {},
  onBlockUser = () => {},
  onReportUser = () => {},
  isMuted = false,
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

  let isOnline = onlineUsers?.includes(isconversationAGroup ? conversationSelected : userB);


  const SectionLabel = ({ label, icon: Icon }) => (
    <div className="flex items-center gap-1.5 px-1 mb-2.5">
      {Icon && <Icon size={12} className="text-gray-500" />}
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, onClick, danger }) => (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-3 py-2.5 rounded-md
        text-[13.5px] font-medium
        transition-colors duration-150
        ${danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-gray-300 hover:bg-[#22283a] hover:text-white"
        }
      `}
    >
      <Icon size={16} className={danger ? "text-red-400" : "text-gray-400"} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="h-full w-full bg-[#212634] text-white flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[70px] border-b border-[#2a3040] flex-shrink-0">
        <div className="flex flex-col">
          <p className="text-[15px] font-semibold text-white leading-tight">
            {isconversationAGroup ? "Group Info" : "User Info"}
          </p>
          <p className="text-[11px] text-gray-500">
            {isconversationAGroup ? "Details & members" : "Profile & shared groups"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">

        <div className="flex flex-col items-center pt-8 pb-6 px-5 border-b border-[#2a3040]">
          <div className="relative mb-3">

          {conversationSelectedPfp ? 
            <img src={conversationSelectedPfp} className="w-20 h-20 rounded-full object-cover ring-2 ring-[#2a3142] shadow-md" />
            : 
            <div className="w-20 h-20 rounded-full bg-[#1d2235] flex items-center justify-center ring-2 ring-[#2a3142] shadow-md">
              {isconversationAGroup
                ? <UsersRound size={30} className="text-gray-400" />
                : <UserRound size={30} className="text-gray-400" />
              }
            </div>
          }

            {!isconversationAGroup ? <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-[3px] border-[#212634] ${isOnline ? "bg-emerald-400" : "bg-gray-600"}`} /> : ""}
          </div>

          <h2 className="text-[17px] font-semibold text-white leading-tight tracking-tight">
            {conversationSelectedUsername}
          </h2>

          {!isconversationAGroup ? <span className={`text-[12px] font-medium mt-1 flex items-center gap-1.5 ${
            isOnline ? "text-emerald-400" : "text-gray-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-gray-600"}`} />
            {isOnline ? "Online" : "Offline"}
          </span> : ""}

          {isconversationAGroup && groupMembers && (
            <p className="text-[12px] text-gray-500 mt-1">{groupMembers.length} members</p>)}
        </div>

        <div className="p-4 space-y-4">

          {/* Username row (private only) */}
          {!isconversationAGroup && (
            <div className="flex flex-col">
              <div className="bg-[#1b1f30] rounded-lg border border-[#1d2230] p-3">
              <SectionLabel label={"Username"} icon={UserCheck} />
                <div className="flex items-center gap-3 px-1">

                  <div className="min-w-0">
                    <p className="text-[13px] text-gray-200 truncate">{conversationSelectedUsername}</p>
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
            <div className="flex flex-col">
              <div className="bg-[#1b1f30] rounded-lg border border-[#1d2230] p-3">
              <SectionLabel label={"Group Description"} icon={FileText} />
                <div className="flex items-center gap-3 px-1">
                  <div className="min-w-0">
                    <p className="text-[13px] text-gray-300 leading-relaxed">{conversationSelectedDescription || "No group description"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

       
          {/* Members (group only) */}
          {isconversationAGroup && (
            <div className="flex flex-col">
              <div className="bg-[#1b1f30] rounded-lg border border-[#1d2230] p-2">
              <div className="px-1 pt-1"><SectionLabel label={`Members — ${groupMembers?.length ?? 0}`} icon={UsersRound} /></div>
                {groupMembers.map((conversation, index) => {

                let isAdmin = false;
                groupAdmins.forEach((admin, index)=>{
                  if(conversation._id == admin._id) isAdmin = true; 
                })

                return (
                  <div
                    key={index}
                    className={`
                      group flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer
                      transition-colors duration-150
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
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center ring-1 ring-[#2a3142] group-hover:ring-[#4c7dff]/40 transition">

                      {
                        conversation?.pfp ? (
                          <img src={conversation.pfp} className="h-full w-full object-cover" />
                        ) : (
                          <UserRound size={18} className="text-gray-400" />
                        )
                      }

                    </div>
                    {conversation.type === "private" &&
                      onlineUsers.includes(conversation._id) && (
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-[#1b1f30]" />
                      )}
                  </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-[13.5px] text-gray-200 font-medium truncate">
                          {conversation._id == userB ? conversation?.username + " (You)" : conversation?.username}
                        </p>
                        {isAdmin && (
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                            Admin
                          </span>
                        )}

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
            <div className="flex flex-col">
              <div className="bg-[#1b1f30] rounded-lg border border-[#1d2230] p-2">
              <div className="px-1 pt-1"><SectionLabel label="Common Groups" icon={Link} /></div>
                {commonGroups?.map((group, index) => {
                  return (
                    <div
                      key={index}
                      className={`
                        group flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer
                        transition-colors duration-150
                        hover:bg-[#22283a]
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
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-[#141720] flex items-center justify-center ring-1 ring-[#2a3142] group-hover:ring-[#4c7dff]/40 transition">
                          {
                            group.groupIcon? (
                              <img src={group.groupIcon} className="h-full w-full object-cover" />
                            ) : (
                              <UsersRound size={18} className="text-gray-400" />
                            )
                          }
                        </div>
        
                      </div>
        
                      <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-[13.5px] text-gray-200 font-medium truncate">
                              {group.groupName}
                            </p>
                            <p className="text-[11.5px] text-gray-500 truncate">
                              {group.participants.map(p => p.username).join(", ")}
                            </p>
                      </div>

                      <ChevronRight size={15} className="text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        
                    </div>
                  )
                })}
              </div>
            </div>
          )
          }


          {(isconversationAGroup==false && commonGroups.length == 0)  &&  (
            (
            <div className="flex flex-col">
              <div className="bg-[#1b1f30] rounded-lg border border-[#1d2230] p-3">
              <SectionLabel label="Common Groups" icon={Link} />
                <div className="w-full flex flex-col justify-center items-center py-4 gap-1.5">
                  <UsersRound size={20} className="text-gray-600" />
                  <p className="text-[12.5px] text-gray-500">No common groups found</p>
                </div>
              </div>
            </div>
          )
          )
          }

          {/* Actions */}
          <div className="flex flex-col">
            <div className="bg-[#1b1f30] rounded-lg border border-[#1d2230] p-1.5">
              <div className="px-2.5 pt-1.5"><SectionLabel label="Actions" icon={Shield} /></div>

              <ActionButton
                icon={BellOff}
                label={isMuted ? "Unmute Notifications" : "Mute Notifications"}
                onClick={onMuteToggle}
              />

              <ActionButton
                icon={Trash2}
                label="Clear Chat"
                onClick={onClearChat}
                danger
              />

              {!isconversationAGroup && (
                <ActionButton
                  icon={Ban}
                  label="Block User"
                  onClick={onBlockUser}
                  danger
                />
              )}

              <ActionButton
                icon={Flag}
                label={isconversationAGroup ? "Report Group" : "Report User"}
                onClick={onReportUser}
                danger
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SideOverlay;
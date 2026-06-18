import React, { useEffect, useState } from "react";
import { X, UsersRound, Phone, Mail, Link, Shield, UserCheck, Copy, Check } from "lucide-react";
import { getCommonGroups } from "../Services/groupServices";

function SideOverlay({
  setIsSideBarOpen,
  userA,
  userB,
  conversationSelectedUsername,
  conversationSelectedPfp,
  onlineUsers,
  conversationSelected,
  isconversationAGroup,
  groupMembers,
  groupAdmins,
}) {
  const [commonGroups, setCommonGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [copied, setCopied] = useState(false);

  const handleFindCommonGroups = async () => {
    try {
      const res = await getCommonGroups(userA, userB);
      setCommonGroups(res);
    } catch (err) {
      console.log("error finding common groups", err);
    }
  };

  useEffect(() => {
    if (userA && userB) handleFindCommonGroups();
  }, [userA, userB]);

  const isOnline = onlineUsers?.includes(
    isconversationAGroup ? conversationSelected : userB
  );

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(conversationSelectedUsername);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Avatar = ({ src, name, size = "lg" }) => {
    const dim = size === "lg" ? "w-20 h-20" : "w-10 h-10";
    const text = size === "lg" ? "text-2xl" : "text-sm";
    return src ? (
      <img src={src} className={`${dim} rounded-full object-cover ring-2 ring-[#2a3142]`} />
    ) : (
      <div className={`${dim} rounded-full bg-[#1d2235] flex items-center justify-center ring-2 ring-[#2a3142]`}>
        {isconversationAGroup
          ? <UsersRound size={size === "lg" ? 32 : 16} className="text-gray-400" />
          : <span className={`${text} font-medium text-gray-300`}>{conversationSelectedUsername?.[0]?.toUpperCase()}</span>
        }
      </div>
    );
  };

  const tabs = isconversationAGroup
    ? ["info", "members"]
    : ["info", "groups"];

  return (
    <div className="h-full w-full bg-[#0f111a] text-white flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[10vh] border-b border-[#1f2637] flex-shrink-0">
        <p className="text-[15px] font-semibold text-white">
          {isconversationAGroup ? "Group Info" : "User Info"}
        </p>
        <button
          onClick={() => setIsSideBarOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1f2637] transition-colors"
        >
          {/* <X size={16} className="text-gray-400" /> */}
        </button>
      </div>

      {/* Profile hero */}
      <div className="flex flex-col items-center pt-7 pb-5 px-5 border-b border-[#1f2637] flex-shrink-0">
        <div className="relative mb-4">
          <Avatar src={conversationSelectedPfp} name={conversationSelectedUsername} size="lg" />
          <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#161b27] ${isOnline ? "bg-emerald-400" : "bg-gray-600"}`} />
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[17px] font-semibold text-white leading-tight">
            {conversationSelectedUsername}
          </h2>
          <button onClick={handleCopyUsername} className="text-gray-500 hover:text-gray-300 transition-colors">
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>

        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          isOnline
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-[#1f2637] text-gray-500"
        }`}>
          {isOnline ? "Online" : "Offline"}
        </span>

        {isconversationAGroup && groupMembers && (
          <p className="text-xs text-gray-500 mt-2">
            {groupMembers.length} member{groupMembers.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1f2637] flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[13px] font-medium capitalize transition-colors relative ${
              activeTab === tab ? "text-[#4c7dff]" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#4c7dff] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="p-4 space-y-3">

            {!isconversationAGroup && (
              <div className="bg-[#1a1f2e] rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#1f2637] transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-full bg-[#232a3a] flex items-center justify-center flex-shrink-0">
                    <UserCheck size={14} className="text-[#4c7dff]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500 mb-0.5">Username</p>
                    <p className="text-[13px] text-white truncate">{conversationSelectedUsername}</p>
                  </div>
                </div>
              </div>
            )}

            {isconversationAGroup && (
              <>
                <div className="bg-[#1a1f2e] rounded-xl overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="text-[11px] text-gray-500 mb-1.5">Admins</p>
                    <div className="space-y-2">
                      {groupAdmins?.length > 0 ? groupAdmins.map((admin, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#232a3a] flex items-center justify-center text-[11px] font-medium text-[#4c7dff] flex-shrink-0">
                            {admin.username?.[0]?.toUpperCase()}
                          </div>
                          <p className="text-[13px] text-white truncate">{admin.username}</p>
                          <span className="ml-auto text-[10px] bg-[#4c7dff]/15 text-[#4c7dff] px-2 py-0.5 rounded-full flex-shrink-0">
                            Admin
                          </span>
                        </div>
                      )) : (
                        <p className="text-[13px] text-gray-500">No admins found</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1f2e] rounded-xl overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="text-[11px] text-gray-500 mb-0.5">Created</p>
                    <p className="text-[13px] text-white">Group</p>
                  </div>
                </div>
              </>
            )}

            {/* Quick actions */}
            <div className="bg-[#1a1f2e] rounded-xl overflow-hidden">
              <p className="text-[11px] text-gray-500 px-4 pt-3 pb-2">Quick actions</p>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-[#1f2637] transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-[#232a3a] flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-gray-400" />
                </div>
                <span className="text-[13px] text-gray-300">Send a message</span>
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-[#1f2637] transition-colors text-left border-t border-[#232a3a]">
                <div className="w-8 h-8 rounded-full bg-[#232a3a] flex items-center justify-center flex-shrink-0">
                  <Link size={13} className="text-gray-400" />
                </div>
                <span className="text-[13px] text-gray-300">Copy profile link</span>
              </button>
            </div>

          </div>
        )}

        {/* MEMBERS TAB (groups) */}
        {activeTab === "members" && isconversationAGroup && (
          <div className="p-4 space-y-2">
            {groupMembers?.length > 0 ? groupMembers.map((member, i) => {
              const isAdmin = groupAdmins?.some(a => a._id === member._id);
              const online = onlineUsers?.includes(member._id);
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1f2e] rounded-xl hover:bg-[#1f2637] transition-colors cursor-pointer">
                  <div className="relative flex-shrink-0">
                    {member.pfp
                      ? <img src={member.pfp} className="w-9 h-9 rounded-full object-cover" />
                      : <div className="w-9 h-9 rounded-full bg-[#232a3a] flex items-center justify-center text-[13px] font-medium text-gray-300">{member.username?.[0]?.toUpperCase()}</div>
                    }
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1a1f2e] ${online ? "bg-emerald-400" : "bg-gray-600"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-white font-medium truncate">{member.username}</p>
                    <p className="text-[11px] text-gray-500">{online ? "Online" : "Offline"}</p>
                  </div>
                  {isAdmin && (
                    <span className="text-[10px] bg-[#4c7dff]/15 text-[#4c7dff] px-2 py-0.5 rounded-full flex-shrink-0">
                      Admin
                    </span>
                  )}
                </div>
              );
            }) : (
              <p className="text-[13px] text-gray-500 text-center py-8">No members found</p>
            )}
          </div>
        )}

        {/* GROUPS TAB (private chat) */}
        {activeTab === "groups" && !isconversationAGroup && (
          <div className="p-4 space-y-2">
            {commonGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1f2e] flex items-center justify-center">
                  <UsersRound size={20} className="text-gray-600" />
                </div>
                <p className="text-[13px] text-gray-500">No common groups</p>
              </div>
            ) : (
              commonGroups.map((group) => (
                <div
                  key={group._id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1f2e] rounded-xl hover:bg-[#1f2637] transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-[#232a3a] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {group.groupIcon
                      ? <img src={group.groupIcon} className="w-full h-full object-cover" />
                      : <span className="text-[13px] font-medium text-gray-300">{group.groupName?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-white font-medium truncate">{group.groupName}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {group.participants.map(p => p.username).join(", ")}
                    </p>
                  </div>
                  <Shield size={13} className="text-gray-600 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default SideOverlay;
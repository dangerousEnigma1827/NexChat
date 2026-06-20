import { createContext, useState } from "react";

export const GroupContext = createContext()

export function GroupProvider({children}){

    let [groupName, setGroupName] = useState("")
    let [groupDescription, setGroupDescription] = useState("")
    let [groupMembers, setGroupMembers] = useState()
    let [groupAdmins, setGroupAdmins] = useState()

    return (
        <GroupContext.Provider value={{
            groupName, setGroupName,
            groupDescription, setGroupDescription,
            setGroupMembers, groupMembers,
            groupAdmins, setGroupAdmins
        }}>
            {children}
        </GroupContext.Provider>
    )
}
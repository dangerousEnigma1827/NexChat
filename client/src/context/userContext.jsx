import { createContext, useState } from "react";

export const UserContext = createContext()

export function UserProvider({children}){
    let [currentUserId, setUserId] = useState(null)

    return (
        <UserContext.Provider value={{currentUserId, setUserId}}>
            {children}
        </UserContext.Provider>
    )
}

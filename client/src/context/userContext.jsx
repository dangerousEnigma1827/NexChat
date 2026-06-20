import { createContext, useEffect, useState } from "react";
import api from "../api/apiInstance";

export const UserContext = createContext()

export function UserProvider({children}){
    let [currentUserId, setUserId] = useState(null)
    let token = localStorage.getItem('token')

    let getCurrentUser = async () => {
        console.log("starting")
        try {
            let res = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUserId(res.data._id)
        console.log("done", res.data._id)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        getCurrentUser()
    },[])

    return (
        <UserContext.Provider value={{currentUserId, setUserId}}>
            {children}
        </UserContext.Provider>
    )
}

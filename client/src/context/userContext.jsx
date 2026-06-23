import { createContext, useEffect, useState } from "react";
import api from "../api/apiInstance";

export const UserContext = createContext()

export function UserProvider({children}){
    let [currentUserId, setUserId] = useState(null)
    let [currentUserUsername, setCurrentUserUsername] = useState(null)
    let [currentUserAbout, setCurrentUserAbout] = useState(null)
    let [currentUserPfp, setCurrentUserPfp] = useState(null)
    let [currentUserEmail, setCurrentUserEmail] = useState(null)
    let token = localStorage.getItem('token')

    let getCurrentUser = async () => {
        try {
            let res = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUserId(res.data._id)
            setCurrentUserAbout(res.data.about)
            setCurrentUserUsername(res.data.username)
            setCurrentUserPfp(res.data.pfp)
            setCurrentUserEmail(res.data.email)
            console.log(res.data)

            console.log(res.data.email)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        if(token){
            getCurrentUser()
        }
    },[token])

    return (
        <UserContext.Provider value={{
            currentUserId,
            setUserId,
            currentUserUsername,
            setCurrentUserUsername,
            currentUserAbout,
            setCurrentUserAbout,
            currentUserPfp,
            setCurrentUserPfp, 
            currentUserEmail,
            setCurrentUserEmail,
            getCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}

import { createContext, useEffect, useState } from "react";
import api from "../api/apiInstance";

export const UserContext = createContext();

export function UserProvider({ children }) {

    const [currentUserId, setUserId] = useState(null);
    const [currentUserUsername, setCurrentUserUsername] = useState(null);
    const [currentUserAbout, setCurrentUserAbout] = useState(null);
    const [currentUserPfp, setCurrentUserPfp] = useState(null);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);

    const [userLoading, setUserLoading] = useState(true);


    const getCurrentUser = async (token) => {
        try {
            // console.log("calling /auth/me")
            const res = await api.get("/auth/me")
            // console.log("USER RESPONSE:", res.data)
            if(res.data._id){
                setUserId(res.data._id)
                setCurrentUserUsername(res.data.username)
                setCurrentUserAbout(res.data.about)
                setCurrentUserPfp(res.data.pfp)
                setCurrentUserEmail(res.data.email)
                setUserLoading(false)
            }

        }catch(err){
            console.log("USER ERROR:", err.response?.data || err)
            setUserLoading(false)
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token){
            getCurrentUser(token);
        }
        else{
            setUserLoading(false);
        }
    }, []);



    return (
        <UserContext.Provider
            value={{

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

                userLoading,

                getCurrentUser

            }}
        >

            {children}

        </UserContext.Provider>
    );
}
import axios from 'axios';

let token = localStorage.getItem('token')

export const getCommonGroups = async (userA, userB) => {
    try{
        console.log("1")
        let res = await axios.get(`http://localhost:5000/api/conversations/commonGroups/${userA}/${userB}`,{
            headers:{Authorization: `Bearer ${token}`}
        })
        return res.data
    }catch(err){
        console.log("erorr occured finding common groups", err)
    }
}
import axios from 'axios';
import api from '../api/apiInstance';

let token = localStorage.getItem('token')

export const getCommonGroups = async (userA, userB) => {
    try{
        let res = await api.get(`/conversations/commonGroups/${userA}/${userB}`,{
            headers:{Authorization: `Bearer ${token}`}
        })
        return res.data
    }catch(err){
        console.log("erorr occured finding common groups", err)
    }
}
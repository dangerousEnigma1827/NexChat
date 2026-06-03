import userModels from '../models/userModels.js'

export const userSearchController = async (req,res) => {
    try{
        console.log("111")
        let userSearchFromBackend = await userModels.find({
            username:{
                $regex:req.body.userSearchText,
                $options:"i"
            }
        })
        console.log("222")
        res.json(userSearchFromBackend)
    }catch(err){
        console.log("error finding users of given username in bckd", err)
    }
}
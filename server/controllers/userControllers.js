import userModels from '../models/userModels.js'

export const userSearchController = async (req,res) => {
    try{
        let userSearchFromBackend = await userModels.find({
            username:{
                $regex:req.body.userSearchText,
                $options:"i"
            }
        })
        res.json(userSearchFromBackend)
    }catch(err){
        console.log("error finding users of given username in bckd", err)
    }
}
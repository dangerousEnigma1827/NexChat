import userModels from '../models/userModels.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try{
    let findUserOfEmail = await userModels.findOne({"email":req.body.email});
    let hashedPassword = await bcrypt.hash(req.body.password, 10)

    if(findUserOfEmail){
        return res.status(400).json({
            success:false,
            message: "User Already Exists"
        })
    }

    let registerInBackend = await userModels.create({
        ...req.body, password: hashedPassword
    })

    console.log("created user");
    res.json(registerInBackend)
  }catch(err){
    console.log("error while registering in backend ", err)
  }
};

const login = async (req, res) => {
    try{
        const user = await userModels.findOne({ "email" : req.body.email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("done logging in")
        
        res.json({
            success:true,
            message: "Login Successful",
            user:user,
            token:token
        })

    }catch(err){
        console.log("error in backend while logging in")
    }
};

const me = async (req,res) => {
    try{
        console.log(req.user.userId)
        let currentUser = await userModels.findById(req.user.userId)
        res.json(currentUser);
    }catch(err){
        console.log("error getting current user in backend")
    }
}

const allUsers = async (req,res) => {
    try{
        let allUsers = await userModels.find(
            {
            _id : {$ne : req.user.userId}
            }
        )
        res.json(allUsers);
    }catch(err){
        console.log("error getting all users in backend", err)
    }
}


export { register, login, me , allUsers };
const jwt = require('jsonwebtoken')
const User =require("../models/User.js")
const Admin =require("../models/Admin.js")


const authMiddleware=async(req,res,next)=>{
    const token=req.headers["authorization"]
    if (token && token.startsWith("Bearer")){
        try{
            const tokenSplit=token.split(" ")[1]
            const decodedToken=jwt.verify(tokenSplit,process.env.SECRET_KEY)
            const currentUser=await User.findById(decodedToken.id)
            if(currentUser){
                req.user={id:currentUser.id,role:"user"}
                return next()
            }
            const currentAdmin=await Admin.findById(decodedToken.id)
            if(currentAdmin){
                req.user={id:currentAdmin.id,role:"admin"}
                return next()
            }
            res.status(401).json({success:false,data:{
                "message":"invalid token"
            }})
        }
        catch(err){
            res.status(500).json({success:false,data:{
                message:"Cannot verify token"
            }})
            console.error(err)
        }
    }
    else{
        res.status(401).json({success:false,data:{"message":"no token found"}})
    }
}
module.exports=authMiddleware
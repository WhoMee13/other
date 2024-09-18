const isAdmin = (req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next()
    }
    else{
        throw new Error("Access denied")
        res.status(401).send({success:false,message:"You are not authorized to access this resource."})
    }
}
module.exports = isAdmin
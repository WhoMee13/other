const express = require('express')
const router = express.Router()
const User = require("../models/User")
const auth = require("../middlewares/authMiddleware")
const Admin = require('../models/Admin')

router.post("/",auth,async(req,res)=>{
    // const valueIfCook = await Cook.findOne({username:req.body.username,email:req.body.email})
    // if(valueIfCook && valueIfCook.id===req.user.id && req.user.role === req.body.role){
    //     return res.json({success:true})
    // }
    try{
        const valueIfUser = await User.findOne({email:req.body.email})
        if(valueIfUser && valueIfUser.id===req.user.id && req.user.role === req.body.role){
    
            return res.json({success:true})
        }
        const valueIfAdmin = await Admin.findOne({email:req.body.email})
        if(valueIfAdmin && valueIfAdmin.id===req.user.id && req.user.role === req.body.role){
    
            return res.json({success:true})
        }
        return res.json({success:false})

    }
    catch(err){
        console.log(err)
        return res.json({success:false})
    }

})
module.exports=router
const express = require('express');
const Website = require('../models/Website');
const router = express.Router();
const eah = require("express-async-handler");
const bcrypt = require("bcrypt");
const Admin = require('../models/Admin')
// Middleware to ensure that the user is an admin (You should already have this in place)
const { isAdmin } = require('../middlewares/isAdmin');

// Route for adding a new website
router.post('/', eah(async (req, res) => {
    try {
        if(!req.user && req.user.role==="admin"){
            throw new Error("Access denied")
        }
        // Extract admin from the authenticated user (you could have this from a JWT or session)
        const adminId = req.user.id; // Assuming admin is authenticated and req.user contains admin info
        
        // Extract website information from request body
        const { websiteName, websiteURL } = req.body;
        
        // Create new website and associate with adminId
        const newWebsite = new Website({
            websiteName,
            websiteURL,
            adminId // Associating with the admin
        });
        
        // Save to the database
        await newWebsite.save();
        const admin = await Admin.findByIdAndUpdate(req.user.id,{$push:{websites:newWebsite.id}})
        admin.save()
        res.status(201).json({ success: true, message: "Website added successfully", data: newWebsite });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}));
router.get("/",eah(
    async(req,res)=>{
        try{
            const websites = await Website.find().populate("adminId");
            res.status(200).json({success:true,message:"Websites fetched successfully",data:websites})
        }
        catch(err){
            throw new Error(err)
        }
    }
))
router.delete("/:id",eah(
    async(req,res)=>{
        try{
            await Website.findByIdAndDelete(req.params.id)
            res.json({success:true,message:"Website is deleted"})
        }
        catch(err){
            throw new Error(err)
        }
    }
))

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { userName, address, contact, email, password } = req.body;
        const user = new User({ userName, address, contact, email, password });
        await user.save();
        res.status(201).json({success:true,message:'User registered successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message});
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({success:false,message:'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({sucess:false,message:'Invalid credentials'});

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        res.json({success:true,message:"User loggin successfull",data:{
            username:user.userName,address:user.address,contact:user.contact,email:user.email,role:user.role,token: token
        } });
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message});
    }
});

module.exports = router;

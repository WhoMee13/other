const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const router = express.Router();
const jwt = require("jsonwebtoken")

// Add a new admin with hashed password
router.post('/add', async (req, res) => {
    try {
        const { adminName, email, password } = req.body;

        // Check if the email or adminID already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { adminID }] });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin with the same email or ID already exists.' });
        }

        // Create the new admin and hash password automatically (thanks to pre-save hook in the schema)
        const admin = new Admin({ adminID, adminName, email, password });
        await admin.save();

        res.status(201).json({ success: true, message: 'Admin added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the admin by email
        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY);


        res.status(200).json({ success: true, message: 'Login successful', data: {
            adminName:admin.adminName,
            email:admin.email,
            role:"admin",
            token:token
        } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

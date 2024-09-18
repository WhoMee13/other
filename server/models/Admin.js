const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    password:{type:String,required:true,select:false},
    email: { type: String, required: true },
    role:{type:String,default:"admin",immutable:true},
    websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }] // Manages many websites
});
// Hash the password before saving
adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
adminSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

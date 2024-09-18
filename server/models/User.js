const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true ,select:false},
    role:{type:String,default:'user',immutable:true}
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};
userSchema.post('findByIdAndDelete', async function(doc) {
  if(doc){
    try {
      await mongoose.model('Cart').deleteMany({ userId: doc._id });
      await mongoose.model('Order').deleteMany({ userId: doc._id });

    } catch (error) {
      console.log(error);
    }
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

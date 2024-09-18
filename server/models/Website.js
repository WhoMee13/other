const mongoose = require('mongoose');
const Admin = require('./Admin');

const websiteSchema = new mongoose.Schema({
    websiteURL: { type: String, required: true },
    websiteName: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  // Website contains multiple products
});

// Post hook after deletion
websiteSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        console.log("Removing website with id:", doc._id);

        try {
            // Delete related products
            await mongoose.model('Product').deleteMany({ websiteId: doc._id });
            
            // Remove the website from the Admin's websites array
            await mongoose.model('Admin').updateMany(
                { websites: { $in: [doc._id] } }, 
                { $pull: { websites: doc._id } }
            );
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
});

module.exports = mongoose.model('Website', websiteSchema);

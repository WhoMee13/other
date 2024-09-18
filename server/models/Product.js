const mongoose = require('mongoose');
const Website = require("./Website")
const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website' },
    createdAt:{type:Date,default:Date.now()},
    imageUrl: {
        type: String, // Store the path to the image
        required: false
      }
});
productSchema.post('findByIdAndRemove', async function(doc) {
  if(doc){

    try {
      await mongoose.model('Order').deleteMany({ products: doc._id });
      await Website.updateMany({products:{$in:[doc._id]}},{$pull:{$products:doc._id}})
    } catch (error) {
      console.log(error);
    }
  }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;

const mongoose = require('mongoose');
const Product = require('./Product'); // Import your Product model

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderAmount: { type: Number },
    products: { 
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
        required: true 
    },
    orderDate: { type: Date, default: Date.now },
    isPending:{type:Boolean,default:true}
});

// Pre-save hook to calculate orderAmount
orderSchema.pre('save', async function (next) {
    try {   
        // Check if products array exists
        if (this.products && this.products.length > 0) {
            // Retrieve product details
            const products = await Product.find({ '_id': { $in: this.products } });
            
            // Calculate total amount
            const totalAmount = products.reduce((sum, product) => sum + product.price, 0);
            
            // Set orderAmount
            this.orderAmount = totalAmount;
        } else {
            this.orderAmount = 0; // No products means zero amount
        }
        
        next(); // Proceed with saving the document
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

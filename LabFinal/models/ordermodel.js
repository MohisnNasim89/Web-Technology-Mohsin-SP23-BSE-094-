const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
    products: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', // Reference to the Product model
                required: true 
            },
            quantity: { type: Number, required: true },
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed'], 
        default: 'Pending' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', orderSchema);

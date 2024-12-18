const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  title: {
    type: String,       
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ["Cakes", "Cookies", "Sundae", "Cupcakes"],
    trim: true
  },
  picture: {
    type: String,
    required: false,   
  },
  price: {
    type: Number,        
    required: true,      
    min: 0
  },
  quantity:{
    type: Number,
    required: true,
    min: 0
  }
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

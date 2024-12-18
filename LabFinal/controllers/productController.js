const Product = require("../models/productmodel");
const mongoose = require("mongoose");

exports.getAllProductsForMenu = async (req, res) => {
    try {
        const products = await Product.find();  // Get all products
        const categories = [...new Set(products.map(product => product.category))]; // Unique categories

        res.render("user/menu", {  // Make sure to adjust the name of the view if necessary
            pageTitle: "Menu",
            products,
            categories
        });
    } catch (error) {
        console.error("Error fetching products for menu:", error);
        res.status(500).send("Error fetching products for menu");
    }
};


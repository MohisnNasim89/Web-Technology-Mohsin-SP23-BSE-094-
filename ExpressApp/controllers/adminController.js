const multer = require("multer");
const Product = require("../models/productmodel");
const mongoose = require("mongoose");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });

exports.upload = upload;

exports.getAllProducts = async (req, res) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1; // Read page from query
        const pageSize = 3;

        const { category, sort, search } = req.query;

        const query = {};
        if (category) {
            query.category = category; // Filter by category
        }
        if (search) {
            query.title = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        let sortQuery = {};
        if (sort === "asc") sortQuery.price = 1;
        else if (sort === "desc") sortQuery.price = -1;

        // Total records for pagination
        const totalRecords = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Fetch products based on query, pagination, and sorting
        const products = await Product.find(query)
            .sort(sortQuery)
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        // Pass data to the view
        res.render("admin/products", {
            layout: "adminlayout",
            pageTitle: "Manage Your Products",
            products,
            page,
            pageSize,
            totalPages,
            totalRecords,
            category,
            sort,
            search,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    }
};
// Render the form for creating a new product
exports.renderCreateForm = (req, res) => {
    res.render("admin/createProduct", { layout: "adminlayout" });
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { title, description, category, price, quantity } = req.body;

        const newProduct = new Product({
            title,
            description,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),  // Ensure quantity is an integer
            picture: req.file ? req.file.filename : undefined,
        });

        await newProduct.save();
        res.redirect("/admin/products");
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send("Error creating product");
    }
};

// Render the form for editing an existing product
exports.renderEditForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        res.render("admin/editProduct", { layout: "adminlayout", product });
    } catch (error) {
        console.error("Error fetching product for edit:", error);
        res.status(500).send("Error fetching product for edit");
    }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");

        // Update product fields
        product.title = req.body.title || product.title;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : product.quantity;

        if (req.file) product.picture = req.file.filename;

        await product.save();
        const currentPage = req.query.page || 1;
        res.redirect(`/admin/products?page=${currentPage}`);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product");
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin/products");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product");
    }
};

// Get product by ID (for viewing details)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found!");
        res.render("admin/product", { layout: "adminlayout", pageTitle: "Product Details", product });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).send("An error occurred while fetching the product.");
    }
};

exports.renderDashboard = (req, res) => {
    res.render("admin/admin", { layout: "adminlayout", pageTitle: "Admin Dashboard" });
};

exports.viewAnalytics = (req, res) => {
    const analyticsData = {
        totalSales: 1200,
        totalProducts: 150,
        topSelling: "Chocolate Cake",
    };
    res.render("admin/analytics", { layout: "adminlayout", pageTitle: "Analytics", analytics: analyticsData });
};
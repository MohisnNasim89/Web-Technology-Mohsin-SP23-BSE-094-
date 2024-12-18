const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

router.use(cartController.setCartItems);

// Menu Route
router.get('/menu', productController.getAllProductsForMenu);

module.exports = router;

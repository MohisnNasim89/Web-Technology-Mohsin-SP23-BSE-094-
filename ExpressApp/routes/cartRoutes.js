const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.use(cartController.setCartItems);

// Cart Actions
router.post("/add-to-cart/:id", cartController.addToCart);
router.post("/update", cartController.updateCartItemQuantity);
router.post("/remove", cartController.removeFromCart);

module.exports = router;

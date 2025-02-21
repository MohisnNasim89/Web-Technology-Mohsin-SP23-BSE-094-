const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.renderDashboard);
router.get("/products", adminController.getAllProducts);
router.get("/products/create", adminController.renderCreateForm);
router.post("/products/create", adminController.upload.single("file"), adminController.createProduct);
router.get("/products/edit/:id", adminController.renderEditForm);
router.post("/products/edit/:id", adminController.upload.single("file"), adminController.updateProduct);
router.get("/products/delete/:id", adminController.deleteProduct);
router.get("/products/:id", adminController.getProductById);
router.get("/analytics", adminController.viewAnalytics);

module.exports = router;

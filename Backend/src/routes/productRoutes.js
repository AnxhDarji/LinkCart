const express = require("express");
const router = express.Router();
const { createProduct, getMyProducts, getPublicProducts, getProductBySlug } = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

router.post("/create", verifyToken, upload.single("image"), createProduct);
router.get("/my", verifyToken, getMyProducts);
router.get("/public", getPublicProducts);
router.get("/:slug", getProductBySlug);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
    createProduct,
    getMyProducts,
    getPublicProducts,
    getProductBySlug,
    markAsSold,
    toggleVisibility,
    deleteProduct,
    editProduct,
} = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

router.post("/create", verifyToken, upload.single("image"), createProduct);
router.get("/my", verifyToken, getMyProducts);
router.get("/public", getPublicProducts);
router.put("/:id/sold", verifyToken, markAsSold);
router.put("/:id/visibility", verifyToken, toggleVisibility);
router.put("/:id/edit", verifyToken, editProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.get("/:slug", getProductBySlug);

module.exports = router;

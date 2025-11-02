const express = require("express");
const router = express.Router();
const { getProducts, postProducts, updateProduct, deleteProduct, getProduct } = require("../controllers/productController");

router.get("/api/products" , getProducts);
router.get("/api/product/:id" , getProduct);
router.post("/api/addProduct" , postProducts);
router.put("/api/editProduct/:id" , updateProduct);
router.delete("/api/deleteProduct/:id" , deleteProduct);

module.exports = router;
const express = require("express");
const router = express.Router();
const { 
  getItemsList, 
  getUserPrices, 
  savePricesBulk 
} = require("../controllers/pricelistController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/items", authMiddleware, getItemsList);

router.get("/my-prices", authMiddleware, getUserPrices);

router.post("/save-bulk", authMiddleware, savePricesBulk);

module.exports = router;
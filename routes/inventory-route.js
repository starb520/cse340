// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to inventory details
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// route to get a new classification from user input
router.get("/management-view", invController.getNewClassification);

module.exports = router;
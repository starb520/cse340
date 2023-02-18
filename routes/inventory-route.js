// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to inventory details
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// route to get a new classification from user input
router.get("/management-view", invController.buildVehicleManagement);

// build a route to display a form to receive user input to add a new classification
router.get("/add-classification", invController.getNewClassification);

// build a route to send the add new classification input to the database
router.post("/add-classification", invController.addNewClassification);



module.exports = router;
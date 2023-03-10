// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require('../utilities/inventory-validation.js')
const utilities = require('../utilities')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to inventory details
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// route to get a new classification from user input
router.get("/", utilities.checkClientLevel, invController.buildVehicleManagement);

// build a route to display a form to receive user input to add a new classification
router.get("/add-classification", invController.getNewClassification);

// build a route to send the add new classification input to the database
router.post("/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addNewClassification);

// build a route to display a form to receive user input to add a new vehicle
router.get("/add-vehicle", invController.getNewVehicle);

// build a route to send user input to database to add a vehicle to the inventory
router.post("/add-vehicle", 
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    invController.addNewVehicle);



module.exports = router;
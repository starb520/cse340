// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require('../utilities/inventory-validation.js')
const utilities = require('../utilities')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassification));

// Route to inventory details
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// route to get a new classification from user input
router.get("/", utilities.checkLogin, utilities.checkClientLevel, utilities.handleErrors(invController.buildVehicleManagement));

// build a route to display a form to receive user input to add a new classification
router.get("/add-classification", utilities.checkLogin, utilities.checkClientLevel, utilities.handleErrors(invController.getNewClassification));

// build a route to send the add new classification input to the database
router.post("/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

// build a route to display a form to receive user input to add a new vehicle
router.get("/add-vehicle", utilities.checkLogin, utilities.checkClientLevel, utilities.handleErrors(invController.getNewVehicle));

// build a route to send user input to database to add a vehicle to the inventory
router.post("/add-vehicle", 
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle));

// build a route to display the classifications for a user
router.get("/getVehicles/:classification_id", invController.getVehiclesJSON);

// route to a view to allow editting of the vehicle information 
router.get("/edit/:inv_id", invController.editVehicleView);

// route to handle the request to update a vehicle's details
router.post("/edit-vehicle", 
    invValidate.vehicleRules(), 
    invValidate.checkUpdateData,
    invController.updateVehicle, 
    );

// route to a view to allow deleting of the vehicle information 
router.get("/delete/:inv_id", invController.deleteVehicleView);

// route to handle the request to delete a vehicle's details
router.post("/delete-vehicle", invController.deleteVehicle);

module.exports = router;
// needed resources
const express = require("express");                        // express package
const router = new express.Router();                       // express.Router() function
const util = require("../utilities"); 
const errorController = require("../controllers/errorController.js");  

// route to build an error view
router.get("/", util.handleErrors(errorController.buildError));

module.exports = router;
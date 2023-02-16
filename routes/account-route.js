// needed resources
const express = require("express");                                // express package
const router = new express.Router();                               // express.Router() function
const util = require("../utilities");                               // needs access to the "utilities > index" file
const accController = require("../controllers/accountController.js");  // access to the accounts controller

// Route to build inventory by classification view
router.get("/login", accController.buildLogin);

// route to build the registration view
router.get("/register", accController.buildRegister);


module.exports = router;

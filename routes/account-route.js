// needed resources
const express = require("express");                                // express package
const router = new express.Router();                               // express.Router() function
const util = require("../utilities");                               // needs access to the "utilities > index" file
const accController = require("../controllers/accountController.js");  // access to the accounts controller
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", accController.buildLogin);


// route to build the registration view
router.get("/register", accController.buildRegister);


// build a route to send info from the registration form to the database, but validate data first
router.post("/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    accController.registerClient)


// routes to handle user login
router.post("/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accController.loginClient)


router.get("/", util.checkJWTToken, util.jwtAuth, accController.manageAccount);


// middleware

module.exports = router;

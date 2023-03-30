// needed resources
const express = require("express");                        // express package
const router = new express.Router();                       // express.Router() function
const util = require("../utilities");                      // needs access to the "utilities > index" file
const accController = require("../controllers/accountController.js");  // access to the accounts controller
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", util.handleErrors(accController.buildLogin));


// route to build the registration view
router.get("/register", util.handleErrors(accController.buildRegister));


// build a route to send info from the registration form to the database, but validate data first
router.post("/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    util.handleErrors(accController.registerClient))


// routes to handle user login
router.post("/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    util.handleErrors(accController.loginClient))


router.get("/", util.checkJWTToken, util.jwtAuth, util.handleErrors(accController.manageAccount));

router.get("/logout", util.handleErrors(accController.logoutClient));

// route to a view to allow a user to update account information
router.get("/update-account/:client_id", accController.updateAccountView);

// route to handle the request to change a user's info
router.post("/account-update", 
    regValidate.updateClientInfoRules(), 
    regValidate.checkupdateClientInfoData, 
    util.handleErrors(accController.updateAccountInfo));

router.post("/password-update", 
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    util.handleErrors(accController.updatePassword))


module.exports = router;

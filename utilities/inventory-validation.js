const utilities = require("./")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")




/***********************************
*  Add Classification Data Validation Rules
***********************************/
validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .isLength({ min: 2 })
        .withMessage("A valid classification should be used.")
        .custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkClassification(classification_name)
            if (classificationExists) {
                throw new Error("Classification exists.")
            }
        }),
    ]
  }


/*************************************************
* Uses the classificationRules to find any validation errors
* and returns any errors to the add-classification view, else
* calls the next() function to continue to the add classification
* process.
************************************************/
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("../views/inventory/add-classification", {
            errors,
            message: null,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
  }


/*  **********************************
 *  Add a new vehicle rules.
 * ********************************* */
validate.vehicleRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide the vehicle make."),
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle model."),
  
      body("inv_description")
        .trim()
        .escape()
        .isLength({min: 3})
        .withMessage("Please provide a vehicle description."),
  
      // password is required and must be strong password
      body("inv_price")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Please provide the vehicle price"),

      // valid email is required and cannot already exist in the DB
      body("inv_year")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ min: 4 })
        .withMessage("Please provide the vehicle year."),

      // valid email is required and cannot already exist in the DB
      body("inv_miles")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide the number of miles."),

      // valid email is required and cannot already exist in the DB
      body("inv_color")
        .trim()
        .escape()
        .isLength({ min: 2})
        .withMessage("Please provide the vehicle color."),
    ]
  }


/*************************************************
* Use the vehicleRules to validate and find errors, if
* there are errors return them to user to fix, else
* call next() function to move through the add new vehicle
* process.
************************************************/
validate.checkVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classifications = await inventoryModel.getClassifications()
        let classificationMenu = await utilities.displayClassifications(classification_id)
        res.render("../views/inventory/add-vehicle", {
            errors,
            message: null,
            title: "Add Vehicle",
            nav,
            inv_make,
            inv_model,
            inv_description,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            classificationMenu,
        })
        return
    }
    next()
  }


/*************************************************
* Use the vehicleRules to validate and find errors
* when a user is editing a vehicle's information, if
* there are errors return user to the edit view, else
* call next() function to move through the add new vehicle
* process.
************************************************/
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classifications = await inventoryModel.getClassifications()
      let classificationMenu = await utilities.displayClassifications(classification_id)
      const vehicleName = `${inv_make} ${inv_model}`
      res.render("../views/inventory/edit-vehicle", {
          errors,
          message: null,
          title: "Edit " + vehicleName,
          nav,
          inv_make,
          inv_model,
          inv_description,
          inv_price,
          inv_year,
          inv_miles,
          inv_color,
          classification_id,
          classificationMenu,
          inv_id,
      })
      return
  }
  next()
}

  module.exports = validate;
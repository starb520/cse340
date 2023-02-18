const invModel = require("../models/inventory-model")  // path to the inventory-model, functions to query SQL database
const utilities = require("../utilities")              // path to utilities folder

const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehiclesByClassificationId(classificationId)
    let nav = await utilities.getNav()
    const className = data[0].classification_name 
    res.render("./inventory/classification-view", {
        title: className + " vehicles",
        nav, 
        message: null,
        data,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventoryId = req.params.inventoryId
    let data = await invModel.getVehiclesByInventoryId(inventoryId)
    let view = await utilities.displayInvDetails(data);
    let nav = await utilities.getNav()
    res.render("./inventory/inventory-detail", {
        title: `${data[0].inv_make} ${data[0].inv_model}`,
        nav,
        message: null,
        view,
    })
}


// function to give user options to add new classification or add new vehicle
invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/management-view.ejs", {
      title: "Vehicle Management",
      nav,
      message: null,
    })
  }

// function to build a page to add a new classification
invCont.getNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/add-classification.ejs", {
       title: "Add New Vehicle Classification",
       nav,
       message: null, 
    })
 }

 // add a new classification to the 
 /* ****************************************
 *  Process registration request
 **************************************** */
invCont.addNewClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } =
      req.body
  
    const regResult = await invModel.addNewClassification(
      classification_name
    )
    // console.log(regResult)
    if (regResult) {
      res.status(201).render("../views/inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message: `Congratulations, you\'ve added the ${classification_name} vehicle classification.`,
        errors: null,
      })
    } else {
      const message = "Sorry, the registration failed."
      res.status(501).render("../views/inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message,
        errors: null,
      })
    }
  }

module.exports = invCont;
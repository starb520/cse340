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


// function to get a new classification from user
invCont.getNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/management-view.ejs", {
      title: "Add A New Inventory Classification",
      nav,
      message: null,
    })
  }

module.exports = invCont;
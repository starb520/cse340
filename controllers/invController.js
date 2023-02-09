const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

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

invCont.buildByInventoryID = async function (req, res, next) {
    const inventoryID = req.params.inventory_id
    let data = await invModel.getVehiclesByInventoryID(inventoryID)
    let nav = await utilities.getNav()
    res.render("./inventory/inventory-detail", {
        title: "vehicles",
        nav,
        message: null,
        data,
    })
}

module.exports = invCont;
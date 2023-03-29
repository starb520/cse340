const invModel = require("../models/inventory-model")  // path to the inventory-model, functions to query SQL database
const utilities = require("../utilities")              // path to utilities folder
const invCont = {}

// build a view of vehicles when the user clicks on a classification
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
        errors: null,
    })
}

// individual vehicle details display
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
        errors: null,
    })
}

// function to give user options to add new classification or add new vehicle
invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classifications = await invModel.getClassifications()
    let classificationMenu = await utilities.displayClassifications(classifications)
    res.render("../views/inventory/management-view.ejs", {
      title: "Vehicle Management",
      nav,
      message: null,
      errors: null,
      classificationMenu,
    })
  }

// function to build a page to display a form to add a new classification
invCont.getNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("../views/inventory/add-classification.ejs", {
       title: "Add New Vehicle Classification",
       nav,
       message: null, 
       errors: null,
    })
 }

// add a new classification to the classification table
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


// function to build a page to display a form to add a new vehicle
invCont.getNewVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classifications = await invModel.getClassifications()
    let classificationMenu = await utilities.displayClassifications(classifications)
    res.render("../views/inventory/add-vehicle.ejs", {
       title: "Add New Vehicle",
       nav,
       message: null, 
       classificationMenu,
       errors: null,
    })
 }

// add a new vehicle to the inventory table
invCont.addNewVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
          inv_price, inv_miles, inv_color, classification_id } =
    req.body

  const regResult = await invModel.addNewVehicle(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color, classification_id
  )
  // console.log(regResult)
  if (regResult) {
    res.status(201).render("../views/inventory/management-view.ejs", {
      title: "Vehicle Management",
      nav,
      message: `Congratulations, you\'ve added a ${inv_make, inv_model} vehicle.`,
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

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invCont.getVehiclesJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const vehicleData = await invModel.getVehiclesByClassificationId(classification_id)
  if (vehicleData[0].inv_id) {
    return res.json(vehicleData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.editVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicleData = await invModel.getVehiclesByInventoryId(inv_id)
  const classificationMenu = await utilities.displayClassifications(vehicleData[0].classification_id)
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("../views/inventory/edit-vehicle.ejs", {
    title: "Edit " + vehicleName,
    nav,
    classificationMenu: classificationMenu,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    inv_color: vehicleData[0].inv_color,
    classification_id: vehicleData[0].classification_id
  })
}


// add updated vehicle details to the inventory table
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,
    inv_miles, inv_color, classification_id, inv_id } =
    req.body

    const updateResult = await invModel.updateVehicle(
      inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,
      inv_miles, inv_color, classification_id, inv_id
  )
  // console.log(regResult)
  
  if (updateResult) {
    const classificationMenu = await utilities.displayClassifications(classification_id)
    const vehicleName = inv_make + " " + inv_model
    res.status(201).render("../views/inventory/management-view.ejs", {
      title: "Vehicle Management",
      nav,
      message: `The ${vehicleName} was successfully updated.`,
      errors: null,
      classificationMenu,
    })
  } else {
    const inv_id = inv_id
    const classificationMenu = await utilities.displayClassifications(classification_id)
    const vehicleName = `${inv_make} ${inv_model}`
    res.status(501).render("../views/inventory/edit-vehicle.ejs", {
      title: "Edit " + vehicleName,
      nav,
      classificationMenu: classificationMenu,
      message: "Sorry, the insert failed.",
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}


/* ***************************
 *  Build delete vehicle view
 * ************************** */
invCont.deleteVehicleView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicleData = await invModel.getVehiclesByInventoryId(inv_id)
  const classificationMenu = await utilities.displayClassifications(vehicleData[0].classification_id)
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("../views/inventory/delete-vehicle.ejs", {
    title: "Delete " + vehicleName,
    nav,
    classificationMenu: classificationMenu,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_price: vehicleData[0].inv_price,
    classification_id: vehicleData[0].classification_id
  })
}


// delete the vehicle from the database
invCont.deleteVehicle = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_price, inv_year, classification_id, inv_id } = req.body

  const deleteResult = await invModel.deleteVehicle(inv_id)
  // console.log(regResult)
  
  if (deleteResult) {
    const classificationMenu = await utilities.displayClassifications(classification_id)
    const vehicleName = inv_make + " " + inv_model
    res.status(201).render("../views/inventory/management-view.ejs", {
      title: "Vehicle Management",
      nav,
      message: `The ${vehicleName} was successfully deleted.`,
      errors: null,
      classificationMenu,
    })
  } else {
    const inv_id = inv_id
    const classificationMenu = await utilities.displayClassifications(classification_id)
    const vehicleName = `${inv_make} ${inv_model}`
    res.status(501).render("../views/inventory/delete-vehicle.ejs", {
      title: "Delete " + vehicleName,
      nav,
      classificationMenu: classificationMenu,
      message: "Sorry, the delete failed.",
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      classification_id,
    })
  }
}


module.exports = invCont;
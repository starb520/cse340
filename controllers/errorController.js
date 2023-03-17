const utilities = require('../utilities')
const errorController = {}                  //may not need, if async function is used


/*****************************************
*  Deliver an error view when the error link
* is clicked.
*****************************************/
async function buildError(req, res, next) {
    let nav = await utilities.getNav()
    res.render("errors/error.ejs", {
      title: "Error",
      nav2, 
      errors: null,
      message: null,
    })
  }

  module.exports = { buildError }
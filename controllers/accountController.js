const utilities = require('../utilities')


/* ****************************************
*  Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("clients/login", {
      title: "Login",
      nav,
      message: null,
    })
  }
  

/*****************************************
*  Deliver registration view
**************************************** */
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("clients/register", {
      title: "Register",
      nav, 
      errors: null,
      message: null,
    })
  }


  module.exports = { buildLogin, buildRegister }
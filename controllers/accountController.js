const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config


/* ****************************************
*  Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("clients/login", {
      title: "Login",
      nav,
      message: null,
      errors: null,
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


/* ****************************************
 *  Process registration request
 **************************************** */
async function registerClient(req, res) {
  let nav = await utilities.getNav()
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10)
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: 'Sorry, there was an error processing the registration.',
      errors: null,
    })
  }

  const regResult = await accountModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  )
  // console.log(regResult)
  if (regResult) {
    res.status(201).render("clients/login.ejs", {
      title: "Login",
      nav,
      message: `Congratulations, you\'re registered ${client_firstname}. Please log in.`,
      errors: null,
    })
  } else {
    const message = "Sorry, the registration failed."
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
    })
  }
}

/*****************************************
 *  Process login request
 **************************************/
async function loginClient(req, res) {
  let nav = await utilities.getNav()
  const { client_email, client_password } = req.body
  const clientData = await accountModel.getClientByEmail(client_email)
  if (!clientData) {
    const message = "Please check your credentials and try again."
    res.status(400).render("clients/login", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password
      const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true })
      return res.redirect("/client/")
    }
  } catch (error) {
    return res.status(403).send('Access Forbidden')
  }
}


/* ****************************************
*  Deliver account management view after user
*  has logged into their account.
**************************************** */
async function manageAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("clients/account-management.ejs", {
    title: "Login",
    nav,
    message: null,
    errors: null,
  })
}

/*****************************************
*  Deliver home view when a client is logged out
*  of their account.
*****************************************/
async function logoutClient(req, res, next) {
  res.clearCookie("jwt", { httpOnly: true })
  res.redirect('/')
}

  module.exports = { buildLogin, buildRegister, registerClient, loginClient, manageAccount,  logoutClient}
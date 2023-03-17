const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()



// Constructs the nav HTML unordered list
Util.buildNav = function (data) {
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>' 
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
            '<a href="/inv/type/' +
            row.classification_id + 
            '" title="See our inventory of ' +
            row.classification_name + 
            ' vehicles">' + 
            row.classification_name + 
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

// Builds the navigation bar
// This builds the site nav
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    nav = Util.buildNav(data)
    return nav
}

// Builds the detailed information for a specific vehicle
Util.displayInvDetails = function (data) {
    let vehicle = data[0]
    let html = 
    `<h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
    <div id="vehicle-details">
        <img src="${vehicle.inv_image}" alt="car-picture">
        <section id="vehicle-inv-details">
            <h2>${vehicle.inv_make, vehicle.inv_model}</h2>
            <h3>Price ${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</h3>
            <h4 class="description">Description: ${vehicle.inv_description}</h4>
            <h3>Color: ${vehicle.inv_color}</h3>
            <h3>Miles: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</h3>
        </section>
    </div>`
    return html
}

Util.displayClassifications = async function (classification_id = null) {
    let classifications = await invModel.getClassifications()
    let list = "<select id='classification_id' name='classification_id'>"
    list += "<option>Choose a Classification</option>"
    classifications.rows.forEach((row) => {
        list += "<option value='" + row.classification_id +"'"
            if (classification_id != null && row.classification_id == classification_id) {
                list += " selected "
        }
        list += ">" + row.classification_name + "</option>"
    })
    list += '</select>'
    return list
}


/*****************************************
* Middleware to check token validity
*****************************************/
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
      jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, clientData) {
          if (err) {
            res.clearCookie("jwt")
            return res.redirect("/client/login")
          }
        res.locals.clientData = clientData
        res.locals.loggedin = 1
        next()
        })
    } else {
      next()
    }
  }




/*****************************************
 *  Authorize JWT Token
 ***************************************/
Util.jwtAuth = (req, res, next) => {
    const token = req.cookies.jwt
    try {
        const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.clientData = clientData
        res.locals.clientData = clientData
        next()
    } catch (error){
        res.clearCookie("jwt", { httpOnly: true })
        return res.status(403).redirect("/")
    }
    }


/*****************************************
 *  Check Login
 **************************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      return res.redirect("/client/login")
    }
   }


/*****************************
 * Middleware to check for client level.
 * See account-management.ejs partial and 
 * account-route file.
 *****************************/
Util.checkClientLevel = (req, res, next) => {
    if (res.locals.clientData.client_type == "Admin" || res.locals.clientData.client_type == "Employee") {
        next()
    } else {
        res.redirect('/')
    }
}

/*****************************************
 *  Middleware function to redirect user
 *  to an error page.
 **************************************/





/*****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 *****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util
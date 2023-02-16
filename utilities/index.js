const invModel = require("../models/inventory-model")
const Util = {}


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

module.exports = Util
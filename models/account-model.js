const pool = require("../database/")

/************************************
 * Register New Client
 ***********************************/
async function registerClient (
    client_firstname,
    client_lastname,
    client_email,
    client_password
) {
    try {
        const sql = 
            "INSERT INTO client (client_firstname, client_lastname, client_email, client_password, client_type) VALUES ($1, $2,$3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [
            client_firstname,
            client_lastname,
            client_email,
            client_password
        ]) 
    } catch (error) {
        return error.message
    }
}

// adds the functions created in this file to exports to make them available elsewhere when needed
module.exports = {registerClient};
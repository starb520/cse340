const { Pool } = require("pg")
require("dotenv").config()

// Connection Pool
// SSL Object needed for the local testing of app
// But will cause problems in production environemnt
// If - else will make determination which to use

let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
}

module.exports = pool
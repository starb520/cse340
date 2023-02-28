const pool = require("../database/")

async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getVehiclesByClassificationId(classificationId) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1", [classificationId])
        return data.rows
    } catch (error) {
        console.error('getclassificationsbyid error' + error)
    }
}

async function getVehiclesByInventoryId(inventoryId) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [inventoryId])
        return data.rows
    } catch (error) {
        console.error('getvehiclebyid error' + error)
    }
}

/* **********************
 *   Check database for classification name so there are not duplicate classifications
 *   added to the database and thus appearing on the nav bar 
 * ********************* */
async function checkClassification(classification_name){
    try {
      const sql = "SELECT * FROM classification WHERE classification_name = $1"
      const classification = await pool.query(sql, [classification_name])
      return classification.rowCount
    } catch (error) {
      return error.message
    }
  }

// Add a New Classifcation to the Classification Table
async function addNewClassification (classification_name) {
    try {
        const sql = 
            "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name]) 
    } catch (error) {
        return error.message
    }
}

// Add a New Vehicle to the Inventory Table
async function addNewVehicle (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price,
                              inv_miles, inv_color, classification_id) {
    try {
        const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price,inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price,
        inv_miles, inv_color, classification_id])
    } catch (error) {
        return error.message
    }
}


module.exports = {getClassifications, getVehiclesByClassificationId, getVehiclesByInventoryId, addNewClassification, addNewVehicle, checkClassification};
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

// Edit Vehicle Information in the Inventory Table
async function updateVehicle (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,
    inv_miles, inv_color, classification_id, inv_id) {
try {
const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"

const data = await pool.query(sql, [
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  ])
  return data.rows[0]
} catch (error) {
  console.error("model error: " + error)
}
}

// Delete a vehicle in the Inventory Table
async function deleteVehicle (inv_id) {
try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])
  return data
} catch (error) {
//   console.error("model error: " + error)
    next(error)
}
}

module.exports = {getClassifications, getVehiclesByClassificationId, getVehiclesByInventoryId, addNewClassification, addNewVehicle, checkClassification, updateVehicle, deleteVehicle};
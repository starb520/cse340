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

// add a getvehiclesbyid async await function
module.exports = {getClassifications, getVehiclesByClassificationId, getVehiclesByInventoryId};
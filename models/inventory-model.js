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


module.exports = {getClassifications, getVehiclesByClassificationId};
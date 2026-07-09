const express = require('express')
const router = express.Router();

const { 
    createDoctor,
    readAllDoctor,
    readOneDoctor,
    updateDoctor,
    deactivateDoctor
} = require('../controllers/doctorController.js');

router.post("/", createDoctor);
router.get("/", readAllDoctor)
router.get("/:id", readOneDoctor)
router.put("/:id", updateDoctor)
router.delete("/:id", deactivateDoctor)

module.exports = router;
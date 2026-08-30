const express = require('express')
const router = express.Router();

const { 
    createPatient,
    readPatients,
    readOnePatient,
    updatePatient,
    deactivatePatient
} = require("../controllers/patientController.js")

router.post("/", createPatient)
router.get("/", readPatients)
router.get("/:id", readOnePatient)
router.put("/:id", updatePatient)
router.delete("/:id", deactivatePatient)

module.exports = router;
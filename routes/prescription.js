const express = require('express');
const router = express.Router();

const {
    createPrescription,
    readPrescriptions,
    readOnePrescription
} = require("../controllers/prescriptionController.js");

router.post("/", createPrescription);
router.get("/", readPrescriptions);
router.get("/:id", readOnePrescription)

module.exports = router;
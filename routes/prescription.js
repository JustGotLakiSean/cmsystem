const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware.js");

const {
    createPrescription,
    readPrescriptions,
    readOnePrescription
} = require("../controllers/prescriptionController.js");

router.post("/", authMiddleware, requireRole(["doctor"]), createPrescription);
router.get("/", authMiddleware, requireRole(["doctor"]), readPrescriptions);
router.get("/:id", authMiddleware, requireRole(["doctor", "patient"]), readOnePrescription)

module.exports = router;
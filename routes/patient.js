const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware.js");

const { 
    createPatient,
    readPatients,
    readOnePatient,
    updatePatient,
    deactivatePatient,
    getMe
} = require("../controllers/patientController.js")

router.post("/", authMiddleware, requireRole(["admin"]), createPatient);
router.get("/", authMiddleware, requireRole(["admin"]), readPatients);
router.get("/me", authMiddleware, requireRole(["patient"]), getMe);
router.get("/:id", authMiddleware, requireRole(["admin", "doctor"]), readOnePatient);
router.put("/:id", authMiddleware, requireRole(["admin"]), updatePatient);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deactivatePatient);

module.exports = router;
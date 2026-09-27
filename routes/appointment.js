const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware.js");

const {
    createAppointment,
    readAppointment,
    readOneAppointment,
    updateAppointment,
    cancelAppointment
} = require("../controllers/appointmentControllers.js");

router.post("/", authMiddleware, requireRole(["admin"]), createAppointment);
router.get("/", authMiddleware, requireRole(["admin"]), readAppointment);
router.get("/:id", authMiddleware, requireRole(["admin", "doctor", "patient"]), readOneAppointment);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateAppointment);
router.delete("/:id", authMiddleware, requireRole(["admin"]), cancelAppointment);

module.exports = router;
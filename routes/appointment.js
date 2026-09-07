const express = require('express');
const router = express.Router();

const {
    createAppointment,
    readAppointment,
    readOneAppointment,
    updateAppointment,
    cancelAppointment
} = require("../controllers/appointmentControllers.js");

router.post("/", createAppointment);
router.get("/", readAppointment);
router.get("/:id", readOneAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", cancelAppointment);

module.exports = router;
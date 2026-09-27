const express = require("express");
const router = express.Router();

const {
    loginAdmin,
    loginDoctor,
    loginPatient
} = require("../controllers/authController");

router.post("/login", loginAdmin); // admin
router.post("/doctor-login", loginDoctor); // doctor
router.post("/patient-login", loginPatient); // patient

module.exports = router;
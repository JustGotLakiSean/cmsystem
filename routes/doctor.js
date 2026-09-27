const express = require('express')
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware.js");

const { 
    createDoctor,
    readAllDoctor,
    readOneDoctor,
    updateDoctor,
    deactivateDoctor,
    getMe
} = require('../controllers/doctorController.js');

router.post("/", authMiddleware, requireRole(["admin"]), createDoctor);
router.get("/", authMiddleware, requireRole(["admin"]), readAllDoctor);
router.get("/me", authMiddleware, requireRole(["doctor"]), getMe);
router.get("/:id", authMiddleware, requireRole(["admin"]), readOneDoctor);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateDoctor);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deactivateDoctor);

module.exports = router;
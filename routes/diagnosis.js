const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware.js");

const {
    createDiagnosis,
    readDiagnosis,
    readOneDiagnosis,
    updateDiagnosis
} = require("../controllers/diagnosisController.js");

router.post("/", authMiddleware, requireRole(["doctor"]), createDiagnosis);
router.get("/", authMiddleware, requireRole(["doctor"]), readDiagnosis);
router.get("/:id", authMiddleware, requireRole(["doctor", "patient"]), readOneDiagnosis);
router.put("/:id", authMiddleware, requireRole(["doctor"]), updateDiagnosis);

module.exports = router;
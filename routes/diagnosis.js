const express = require("express");
const router = express.Router();

const {
    createDiagnosis,
    readDiagnosis,
    readOneDiagnosis,
    updateDiagnosis
} = require("../controllers/diagnosisController.js");

router.post("/", createDiagnosis);
router.get("/", readDiagnosis);
router.get("/:id", readOneDiagnosis);
router.put("/:id", updateDiagnosis);

module.exports = router;
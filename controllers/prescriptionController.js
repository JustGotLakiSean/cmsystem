const Diagnosis = require('../models/Diagnosis');
const Prescription = require('../models/Prescription');

exports.createPrescription = async (req, res) => {
    try {
        const { diagnosis, medicationName, dosage, frequency, duration, notes } = req.body;

        // validate required fields
        if(!diagnosis || !medicationName || !dosage || !frequency || !duration || !notes) {
            return res.status(400).json({ message: "Missing field required." })
        }

        // check if diagnosis exists
        const diagnosisExist = await Diagnosis.findById(diagnosis)
        if(!diagnosisExist) {
            return res.status(400).json({ message: "Diagnosis not found." })
        }

        // create new Prescription object
        const prescription = new Prescription({
            diagnosis,
            medicationName,
            dosage,
            frequency,
            duration,
            notes
        });

        const savePrescriptions = await prescription.save()
        res.status(201).json({
            message: "Prescription saved.",
            data: savePrescriptions
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

exports.readPrescriptions = async (req, res) => {
    try {
        // find all prescriptions
        const prescription = await Prescription.find()
            .populate({
                path: "diagnosis",
                populate: {
                    path: "appointment",
                    populate: [
                        { path: "doctor", select: "-password" },
                        { path: "patient", select: "-password" }
                    ]
                }
            })

            // return 200 with data
            res.status(200).json({
                message: "Prescriptions retrieved successfully.",
                data: prescription
            })
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// read one prescriptions
exports.readOnePrescription = async (req, res) => {
    try {

        // find prescription by id
        const prescription = await Prescription.findById(req.params.id)
            .populate({
                path: "diagnosis",
                populate: {
                    path: "appointment",
                    populate: [
                        { path: "doctor", select: "-password" },
                        { path: "patient", select: "-password" }
                    ]
                }
            })

            // check if it exists
            if(!prescription) {
                return res.status(404).json({ message: "Prescription not found." })
            }

            // verify role
            if(req.user.role === "patient" && prescription.diagnosis.appointment.patient._id.toString() !== req.user.id) {
                return res.status(403).json({ message: "Forbidden access." })
            }

            if(req.user.role === "doctor" && prescription.diagnosis.appointment.doctor._id.toString() !== req.user.id) {
                return res.status(403).json({ message: "Forbidden access." })
            }

            res.status(200).json({
                message: "Prescription retrieved successfully.",
                data: prescription
            })
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}
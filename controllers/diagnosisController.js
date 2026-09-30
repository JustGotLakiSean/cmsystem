const Appointment = require("../models/Appointment");
const Diagnosis = require("../models/Diagnosis")
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor")

exports.createDiagnosis = async (req, res) => {
    try {
        const { appointment, diagnosisDetails, prescribedTreatment, followUpDate } = req.body;

        // validate field
        if(!appointment || !diagnosisDetails || !prescribedTreatment) {
            return res.status(400).json({ message: "Missing field required." });
        }

        // check if appointment exist
        const appointmentExist = await Appointment.findById(appointment);
        if(!appointmentExist) {
            return res.status(404).json({ message: "Appointment not found." })
        }

        const diagnosis = new Diagnosis({
            appointment,
            diagnosisDetails,
            prescribedTreatment,
            followUpDate
        });

        const savedDiagnosis = await diagnosis.save();
        res.status(201).json({
            message: "Diagnosis saved successfully.",
            data: savedDiagnosis
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// get all diagnosis

exports.readDiagnosis = async (req, res) => {
    try {
        const diagnosis = await Diagnosis.find().populate({
            path: "appointment",
            populate: [
                { path: "doctor", select: "-password" },
                { path: "patient", select: "-password" }
            ]
        })

        res.status(200).json({
            message: "Diagnosis retrieved successfully.",
            data: diagnosis
        })
    } catch (error){
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// get one diagnosis
exports.readOneDiagnosis = async(req, res) => {
    try {
        // get diagnosis
        const diagnosis = await Diagnosis.findById(req.params.id).populate({
            path: "appointment",
            populate: [
                { path: "doctor", select: "-password" },
                { path: "patient", select: "-password" }
            ]
        });

        // check if diagnosis exist
        if(!diagnosis) {
            return res.status(404).json({ message: "Diagnosis not found." })
        }

        // verify role
        if(req.user.role === "patient" && diagnosis.appointment.patient._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden access." })
        }

        if(req.user.role === "doctor" && diagnosis.appointment.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden access." })
        }

        res.status(200).json({
            message: "Diagnosis retrieved successfully.",
            data: diagnosis
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// update diagnosis
exports.updateDiagnosis = async (req, res) => {
    try {
        const { diagnosisDetails, prescribedTreatment, followUpDate } = req.body;
        const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
            req.params.id,
            { diagnosisDetails, prescribedTreatment, followUpDate },
            { returnDocument: 'after' }
        ).populate({
            path: "appointment",
            populate: [
                { path: "doctor", select: "-password" },
                { path: "patient", select: "-password" }
            ]
        });

        // check if diagnosis exist
        if(!updatedDiagnosis) {
            return res.status(404).json({ message: "Diagnosis not found." })
        }

        res.status(200).json({
            message: "Diagnosis updated successfully.",
            data: updatedDiagnosis
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}
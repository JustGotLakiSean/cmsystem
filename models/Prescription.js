const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    diagnosis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnosis",
        required: true
    },
    medicationName: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("Prescription", prescriptionSchema)
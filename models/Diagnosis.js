const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    diagnosisDetails: {
        type: String,
        required: true
    },
    prescribedTreatment: {
        type: String,
        required: true
    },
    followUpDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("Diagnosis", diagnosisSchema)
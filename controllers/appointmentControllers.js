const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient')

// create appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctor, patient, appointmentDate, reason } = req.body;

        // validate field
        if(!doctor || !patient || !appointmentDate || !reason) {
            return res.status(400).json({ message: "Missing field required." })
        }

        // check if Doctor exist
        const doctorExist = await Doctor.findById(doctor)
        if(!doctorExist) {
            return res.status(404).json({ message: "Doctor not found." })
        }

        // check if Patient exist
        const patientExist = await Patient.findById(patient)
        if(!patientExist) {
            return res.status(404).json({ message: "Patient not found." })
        }

        // create appointment object
        const appointment = new Appointment({
            doctor,
            patient,
            appointmentDate,
            reason
        });

        // saved appointment
        const savedAppointment = await appointment.save();
        res.status(201).json({
            message: "Appointment created successfully.",
            data: savedAppointment
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// read all appointment
exports.readAppointment = async ( req, res ) => {
    try {
        const appointment = await Appointment.find()
            .populate("doctor", "-password")
            .populate("patient", "-password")

        res.status(200).json({
            message: "Appointment Retrieved Successfully.",
            data: appointment
        })
    } catch (error) {
        return res.status(500).json({ message: "Server Error.", error: error.message })
    }
}

exports.readOneAppointment = async (req , res) => {
    try {
        // get the appointment
        const appointment = await Appointment.findById(req.params.id)
            .populate("doctor", "-password")
            .populate("patient", "-password");
        
        // check if appointment exist
        if(!appointment) {
            return res.status(404).json({ message: "Appointment not found." })
        }

        // verify role
        if(req.user.role === "patient" && appointment.patient._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden access." });
        }

        if(req.user.role === "doctor" && appointment.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden access." })
        }

        res.status(200).json({
            message: "Appointment retrieved successfully.",
            data: appointment
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// update appointment
exports.updateAppointment = async (req , res) => {
    try {
        // get request from the user
        const { appointmentDate, reason, status } = req.body;

        // update appointment by id
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                appointmentDate,
                reason,
                status
            },
            { returnDocument: 'after' }
        ).populate("doctor", "-password").populate("patient", "-password")

        // check if appt exist
        if(!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found." })
        }

        // return response
        res.status(200).json({
            message: "Appointment updated successfully.",
            data: updatedAppointment
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// cancel appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const cancelledAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { returnDocument: 'after' }
        ).populate("doctor", "-password").populate("patient", "-password")

        // check if appointment exist
        if(!cancelledAppointment) {
            return res.status(404).json({ message: "Appointment not found." })
        }

        res.status(200).json({
            message: "Appointment cancelled successfuly.",
            data: cancelledAppointment
        })
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message })
    }
}

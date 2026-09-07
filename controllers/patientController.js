const Patient = require('../models/Patient');
const bcrypt = require('bcrypt');

// create patient (POST /api/doctors)
exports.createPatient = async ( req, res ) => {
    try {
        const { firstname, lastname, email, username, password, contactNumber, dateOfBirth, medicalHistory } = req.body;

        // Validation
        if(!firstname || !lastname || !email || !username || !password || !contactNumber || !dateOfBirth) {
            return res.status(400).json({ message: "Missing Field Required" })
        }

        // check if email already exist
        const existingEmail = await Patient.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: "Email already exist" })
        }

        // check if username already exist
        const existingUsername = await Patient.findOne({ username })
        if(existingUsername) {
            return res.status(400).json({ message: "Username already exist" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const patient = new Patient({
            firstname,
            lastname,
            email,
            username,
            password: hashedPassword,
            contactNumber,
            dateOfBirth,
            medicalHistory
        });

        const savedPatient = await patient.save();
        const { password: _, ...patientData } = savedPatient.toObject()

        res.status(201).json({
            message: "Patient created successfully",
            data: patientData
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message  })
    }
}

// get all patient data (GET /api/patients)
exports.readPatients = async ( req, res ) => {
    try {
        // find all patients from database
        const patients = await Patient.find()
            .select("-password");
        
        res.status(200).json({
            message: "Patients retrieved successfully",
            data: patients
        })
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// get one patient data (GET /api/patients/:id)
exports.readOnePatient = async ( req, res ) => {
    try {
        // get ID from URL
        const patient = await Patient.findById(req.params.id)
            .select("-password");

        // check if patient exists
        if(!patient) {
            return res.status(404).json({ message: "Patient not found" })
        }

        // return response
        res.status(200).json({ 
            message: "Patient retrieved successfullt",
            data: patient
        })

    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message  })
    }
}

// update patient PUT /api/patients/:id)
exports.updatePatient = async ( req, res ) => {
    try {
        // get updated fields from req.body
        const { firstname, lastname, contactNumber, dateOfBirth, medicalHistory } = req.body;

        // update patient by id
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                firstname,
                lastname,
                contactNumber,
                dateOfBirth,
                medicalHistory
            },
            { returnDocument: 'after' }
        ).select("-password")

        // check if patient exists
        if(!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" })
        }

        // return response
        res.status(200).json({
            message: "Update successful",
            data: updatedPatient
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// deactivate patient (DELETE /api/patients/:id)
exports.deactivatePatient = async ( req, res ) => {
    try {
        // update patient's active field to false
        const deactivatePatient = await Patient.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { returnDocument: 'after' }
        ).select("-password")

        // check if patient exists
        if(!deactivatePatient) {
            return res.status(404).json({ message: "Patient not found" })
        }
        
        // return response
        res.status(200).json({ 
            message: "Deactivated Patient Successfully",
            data: deactivatePatient
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');

// create doctor
exports.createDoctor = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, contactNumber, specialty } = req.body;

        // validate fields
        if( !firstname || !lastname || !email || !username || !password || !contactNumber || !specialty ) {
            return res.status(400).json({ message: "Missing Required Field" })
        }

        // check if email exist
        const existingEmail = await Doctor.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        // check if username exist
        const existingUsername = await Doctor.findOne({ username })
        if(existingUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create doctor object
        const doctor = new Doctor({
            firstname,
            lastname,
            email,
            username,
            password: hashedPassword,
            contactNumber,
            specialty
        });

        const savedDoctor = await doctor.save()
        const { password: _, ...doctorData } = savedDoctor.toObject()

        res.status(201).json({
            message: "Doctor created successfully",
            data: doctorData
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// get all doctor
exports.readAllDoctor = async (req, res) => {
    try {
        // retrieve all doctors from the database
        const doctors = await Doctor.find()
            .select("-password")

        res.status(200).json({
            message: "Doctors retrieved successfully",
            data: doctors
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// retrieve a single doctor by ID
exports.readOneDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .select("-password")
        
        if(!doctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }

        res.status(200).json({
            message: "Doctor retrieved Successfully",
            data: doctor
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// update doctor data
exports.updateDoctor = async ( req, res ) => {
    try {
        // get the request from the page
        const { firstname, lastname, email, username, password, contactNumber, specialty } = req.body

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            {
                firstname,
                lastname,
                email,
                username,
                password,
                contactNumber,
                specialty
            },
            { returnDocument: 'after' }
        ).select("-password")

        if(!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }

        res.status(200).json({
            message: "Update Successful",
            data: updatedDoctor
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// deactivate (soft delete) doctor
exports.deactivateDoctor = async (req, res) => {
    try {
        const deactivateDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { returnDocument: after }
        ).select("-password")

        if(!deactivateDoctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }

        res.status(200).json({
            message: "Deactivate Doctor Successfully",
            data: deactivateDoctor
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
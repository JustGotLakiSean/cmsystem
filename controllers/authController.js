const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// admin login
exports.loginAdmin = async ( req, res ) => {
    try {
        // get username and password from req.body
        const { username, password } = req.body;

        // validate fields
        if(!username || !password) {
            return res.status(400).json({ message: "Missing field required." });
        }

        // find admin username
        const admin = await Admin.findOne({ username });
        if(!admin){
            return res.status(404).json({ message: "Username not found." })
        }

        // compare password with bcrypt
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Wrong password." })
        }

        // generate JWT
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        // return token
        res.status(200).json({
            message: "Login successful.",
            token
        })

    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// doctor login
exports.loginDoctor = async ( req, res ) => {
    try {
        // get username and password / destructuring
        const { username, password } = req.body;

        // validate fields
        if(!username || !password) {
            return res.status(400).json({ message: "Missing field required." });
        }

        // find doctor by username
        const doctor = await Doctor.findOne({ username });
        if(!doctor) {
            return res.status(404).json({ message: "Username not found." })
        }

        // compare password with bcrypt
        const isMatch = await bcrypt.compare(password, doctor.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Incorrect password." })
        }

        // generate JWT
        const token = jwt.sign(
            { id: doctor._id, role: "doctor" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        // return token
        res.status(200).json({
            message: "Login successful.",
            token
        })

    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message })
    }
}

// login patient
exports.loginPatient = async ( req, res ) => {
    try {
        // get username and password
        const { username, password } = req.body;

        // validate fields
        if(!username || !password) {
            return res.status(400).json({ message: "Missing field required." })
        }

        // find patient username
        const patient = await Patient.findOne({ username });
        if(!patient) {
            return res.status(404).json({ message: "Username not found." })
        }

        // compare password
        const isMatch = await bcrypt.compare(password, patient.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Incorrect password." })
        }

        // generate JWT
        const token = jwt.sign(
            { id: patient._id, role: "patient" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(200).json({
            message: "Login successful.",
            token
        })

    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message })
    }
} 
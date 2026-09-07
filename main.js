require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000

app.use(express.json());


// register routes
const doctorRoutes = require("./routes/doctor")
app.use("/api/doctors", doctorRoutes)

const patientRoutes = require("./routes/patient")
app.use("/api/patients", patientRoutes)

const appointmentRoutes = require("./routes/appointment")
app.use("/api/appointments", appointmentRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})
require('dotenv').config()

const mongoose = require('mongoose');
const Admin = require('./models/Admin')
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    try {
        // connect to db
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // hash a password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        // create admin document
        const admin = new Admin({
            firstname: "Jean Joshua",
            lastname: "Villanueva",
            email: "josh@gmail.com",
            username: "josh123",
            password: hashedPassword
        })

        // save document
        const savedAdmin = await admin.save();
        console.log("Admin seeded successfully.", savedAdmin);

    } catch (error) {
        // throw error if seed failed
        console.log("Error seeding admin", error.message);
    } finally {
        // close connection
        mongoose.connection.close();
        console.log("Connection closed.")
    }
}

seedAdmin();
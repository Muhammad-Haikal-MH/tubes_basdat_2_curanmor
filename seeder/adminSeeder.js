import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");



        // cek admin udah ada belum

        const existingAdmin = await User.findOne({

            email: "admin@gmail.com"

        });




        if(existingAdmin) {

            console.log("Admin already exists");

            process.exit();

        }



        const hashedPassword = await bcrypt.hash("admin123", 10);



        await User.create({

            nama: "Admin",

            email: "admin@gmail.com",

            password: hashedPassword,

            role: "admin"

        });



        console.log("Admin created");

        process.exit();

    } catch(error) {

        console.log(error);

        process.exit(1);

    }

};

seedAdmin();
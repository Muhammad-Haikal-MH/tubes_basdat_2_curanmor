import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/User.js";

dotenv.config();

const seedPolisi = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");



        const existingPolisi = await User.findOne({

            email: "polisi@gmail.com"

        });



        if(existingPolisi) {

            console.log("Polisi already exists");

            process.exit();

        }



        const hashedPassword = await bcrypt.hash("polisi123", 10);



        await User.create({

            nama: "Polisi",

            email: "polisi@gmail.com",

            password: hashedPassword,

            role: "polisi"

        });



        console.log("Polisi created");

        process.exit();

    } catch(error) {

        console.log(error);

        process.exit(1);

    }

};

seedPolisi();
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    nama: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ["user", "admin", "polisi"],
        default: "user"
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
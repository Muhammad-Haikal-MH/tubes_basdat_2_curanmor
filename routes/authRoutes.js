import express from "express";

const router = express.Router();



// LOGIN PAGE

router.get("/login", (req, res) => {

    res.render("auth/login");

});



// REGISTER PAGE

router.get("/register", (req, res) => {

    res.render("auth/register");

});



export default router;
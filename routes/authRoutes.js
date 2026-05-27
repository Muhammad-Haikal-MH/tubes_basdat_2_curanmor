import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

// LOGIN PAGE

router.get("/login", (req, res) => {
  res.render("auth/login", {
    currentPage: "",
  });
});

// REGISTER PAGE

router.get("/register", (req, res) => {
  res.render("auth/register", {
    currentPage: "",
  });
});

// regis proses
router.post("/register", async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    // hash

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      nama,
      email,
      password: hashedPassword,
    });

    await user.save();

    // res.status(201).json({
    //     message: "User registered successfully"
    // });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // cek user
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Email tidak ditemukan");
    }
    // cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Password salah");
    }

    // session
    req.session.user = {
      id: user._id,
      nama: user.nama,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role,
    };

    // response
    if (user.role === "admin") {
      return res.redirect("/admin");
    }

    if (user.role === "polisi") {
      return res.redirect("/polisi");
    }
    const redirectTo = req.session.redirectTo || "/";

    delete req.session.redirectTo;

    return res.redirect(redirectTo);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send("Logout gagal");
    }
    res.redirect("/login");
  });
});

export default router;

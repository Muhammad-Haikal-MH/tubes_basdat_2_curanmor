import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import policeRoutes from "./routes/polisiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import session from "express-session";

dotenv.config();

connectDB();


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "lamo-secret",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// Routes
app.use("/", authRoutes);
app.use("/", userRoutes);

app.use("/admin", adminRoutes);

app.use("/polisi", policeRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/adminRoutes.js";
import policeRoutes from "./routes/polisiRoutes.js";



const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Routes
app.use("/admin", adminRoutes);

app.use("/polisi", policeRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
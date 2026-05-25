import express from "express";
import { isLoggedIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin/dashboard");
});

export default router;
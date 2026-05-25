import express from "express";
import { isLoggedIn, isPolisi } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", isLoggedIn, isPolisi, (req, res) => {
  res.render("polisi/dashboard");
});

export default router;
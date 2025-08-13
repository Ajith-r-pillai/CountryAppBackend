import express from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/getme", getMe);

export default router;

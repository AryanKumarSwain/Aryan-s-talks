import express from "express";
import { verifyEmail } from "../controllers/verify.controller.js";

const router = express.Router();

router.post("/verify-email", verifyEmail);

export default router;

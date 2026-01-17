import express from "express";
import { resendVerificationCode } from "../controllers/resend.controller.js";

const router = express.Router();

router.post("/resend-code", resendVerificationCode);

export default router;

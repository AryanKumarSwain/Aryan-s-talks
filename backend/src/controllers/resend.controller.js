import User from "../models/user.model.js";
import { sendVerificationEmail } from "../lib/mailer.js";

/**
 * =========================
 * RESEND VERIFICATION CODE
 * =========================
 */
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await user.save();

    await sendVerificationEmail(email, verificationCode, "verify");

    return res.status(200).json({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("resendVerificationCode error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

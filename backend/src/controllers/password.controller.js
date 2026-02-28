import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../lib/mailer.js";

/**
 * =========================
 * REQUEST PASSWORD RESET (SEND CODE)
 * =========================
 */
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const resetCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000 // 10 minutes
    );

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    try {
      await sendVerificationEmail(email, resetCode, "reset");
    } catch (emailError) {
      console.error("Request reset: email failed", emailError.message);
      user.resetCode = null;
      user.resetCodeExpires = null;
      await user.save();
      return res.status(503).json({
        message: "Could not send verification email. Please try again later.",
      });
    }

    res.status(200).json({
      message: "Password reset code sent to email.",
    });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * =========================
 * RESET PASSWORD USING CODE
 * =========================
 */
export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, code and new password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (
      !user.resetCode ||
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetCode = null;
    user.resetCodeExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

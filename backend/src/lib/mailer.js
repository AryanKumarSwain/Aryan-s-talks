import nodemailer from "nodemailer";

/**
 * Create transporter once (better performance)
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send verification / reset email
 * @param {string} to - receiver email
 * @param {string} code - 6 digit code
 * @param {"verify" | "reset"} type
 */
export const sendVerificationEmail = async (to, code, type = "verify") => {
  try {
    const subject =
      type === "verify"
        ? "Your Verification Code"
        : "Password Reset Verification Code";

    const text =
      type === "verify"
        ? `Your verification code is: ${code}`
        : `Your reset password verification code is: ${code}`;

    await transporter.sendMail({
      from: `"Talks Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to} [${type}]`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};

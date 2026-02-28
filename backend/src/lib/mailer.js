import nodemailer from "nodemailer";
import dns from "dns";

// Prefer IPv4 so SMTP doesn't time out on networks that block IPv6 (ETIMEDOUT on port 465)
dns.setDefaultResultOrder("ipv4first");

/**
 * Create transporter once (better performance)
 */
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in .env for sending emails.");
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send verification / reset email
 * @param {string} to - receiver email
 * @param {string} code - 6 digit code
 * @param {"verify" | "reset"} type
 */
export const sendVerificationEmail = async (to, code, type = "verify") => {
  const transporter = getTransporter();
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
    console.error("Mail error:", error.message);
    if (error.code) console.error("Mail error code:", error.code);
    throw new Error("Email could not be sent");
  }
};

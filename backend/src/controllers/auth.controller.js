
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { sendVerificationEmail } from "../lib/mailer.js";

// TEMPORARY IN-MEMORY SIGNUP CACHE
const signupCache = {};

/**
 * =========================
 * SIGNUP
 * =========================
 */
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    // Hash password and store in cache
    const hashedPassword = await bcrypt.hash(password, 10);
    signupCache[email] = {
      fullName,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    };
    // Send verification email
    await sendVerificationEmail(email, verificationCode, "verify");
    res.status(200).json({
      message: "Verification code sent to email. Please verify your account.",
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
/**
 * =========================
 * COMPLETE SIGNUP AFTER VERIFICATION
 * =========================
 */
export const completeSignup = async (req, res) => {
  const { email, code } = req.body;
  try {
    const cached = signupCache[email];
    if (!cached) {
      return res.status(400).json({ message: "No signup data found. Please sign up again." });
    }
    if (cached.verificationCode !== code || cached.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }
    // Create user in DB
    const newUser = await User.create({
      fullName: cached.fullName,
      email: cached.email,
      password: cached.password,
      isVerified: true,
      verificationCode: null,
      verificationCodeExpires: null,
    });
    // Remove from cache
    delete signupCache[email];
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      message: "Account created and verified successfully.",
    });
  } catch (error) {
    console.error("Error in completeSignup controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * =========================
 * LOGIN
 * =========================
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * =========================
 * LOGOUT
 * =========================
 */
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * =========================
 * UPDATE PROFILE
 * =========================
 */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * =========================
 * CHECK AUTH
 * =========================
 */
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import AuthImagePattern from "../components/AuthImagePattern";
import TalksLogo from "/Talks_logo.png";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1=email, 2=reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const requestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/password/request-reset", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/password/reset", {
        email,
        code,
        newPassword,
      });
      toast.success(res.data.message);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <img src={TalksLogo} alt="Logo" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-base-content/60">
              Reset your password securely
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={requestReset} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Enter reset code"
                className="input input-bordered w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New password"
                  className="input input-bordered w-full pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {message && <p className="text-center">{message}</p>}

          <p className="text-center text-sm">
            Back to{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <AuthImagePattern
        title="Forgot your password?"
        subtitle="No worries, we’ll help you reset it"
      />
    </div>
  );
};

export default ForgotPasswordPage;

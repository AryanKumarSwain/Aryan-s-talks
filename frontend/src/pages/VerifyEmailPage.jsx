import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthImagePattern from "../components/AuthImagePattern";
import TalksLogo from "/Talks_logo.png";

import { useLocation } from "react-router-dom";
const VerifyEmailPage = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const [step, setStep] = useState(initialEmail ? 2 : 1); // If email passed, go to code step
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // STEP 1: Send code
  const sendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/resend/resend-code", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify code
  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call complete-signup to create user only after verification
      const res = await axiosInstance.post("/auth/complete-signup", {
        email,
        code,
      });

      toast.success(res.data.message);
      setMessage(res.data.message);

      // Redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const resendCode = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/resend/resend-code", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* LEFT */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <img src={TalksLogo} alt="Talks Logo" className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold">Verify Your Email</h1>
              <p className="text-base-content/60">Complete verification to continue</p>
            </div>
          </div>

          {/* VERIFY FORM */}
          <div className="space-y-4">
            {step === 1 ? (
              <form onSubmit={sendCode} className="space-y-4">
                <input
                  type="email"
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="space-y-4">
                <input
                  type="text"
                  required
                  maxLength={6}
                  minLength={6}
                  className="input input-bordered w-full"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  onClick={resendCode}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend Code"}
                </button>
              </form>
            )}
            {message && (
              <p className="text-center text-sm text-warning">{message}</p>
            )}
            <button
              className="link link-primary block text-center"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <AuthImagePattern
        title="Verify your email"
        subtitle="Complete verification to continue."
      />
    </div>
  );
};

export default VerifyEmailPage;

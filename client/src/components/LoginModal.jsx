// src/components/LoginModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SignupModal from "./SignupModal";
import apiService from "../services/api";

function LoginModal({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) setEmail(remembered);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.login(email, password);
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("authenticated", "true");
      localStorage.setItem("user", JSON.stringify(response.user));
      onLogin();
      navigate("/");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-indigo-600"
            />
            Remember Me
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowForgotPassword(true);
            }}
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Forgot Password?
          </a>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white font-semibold rounded-lg transition duration-300`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Demo info */}
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
        Create an account to get started
      </p>

      {/* Terms and Privacy */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>By logging in, you agree to our</p>
        <div className="mt-1 font-semibold text-gray-600 dark:text-gray-300">
          <a
            href="https://www.tupae.co/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-white"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="https://www.tupae.co/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-white"
          >
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Don’t have an account?{" "}
        <button
          onClick={() => setShowSignup(true)}
          className="font-semibold hover:text-gray-800 dark:hover:text-white"
        >
          Sign up
        </button>
      </div>

      {/* Modals */}
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
}

export default LoginModal;

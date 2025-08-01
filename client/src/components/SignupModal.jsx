// src/components/SignupModal.jsx
import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

function SignupModal({ onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password: 8+ chars, 1 capital, 1 number or special char
  const isStrongPassword = (password) =>
    /^(?=.*[A-Z])(?=.*[\d\W]).{8,}$/.test(password);

  const getPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    const hasUpper = /[A-Z]/.test(password);
    const hasNumberOrSpecial = /[\d\W]/.test(password);
    if (hasUpper && hasNumberOrSpecial) return "Strong";
    if (hasUpper || hasNumberOrSpecial) return "Medium";
    return "Weak";
  };

  const getStrengthColor = (strength) => {
    if (strength === "Strong") return "text-green-600 dark:text-green-400";
    if (strength === "Medium") return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, company, agree } = form;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setError("First name, last name, email, and password are required.");
    }

    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!isStrongPassword(password)) {
      return setError(
        "Password must be at least 8 characters long, include 1 uppercase letter and 1 number or special character."
      );
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!agree) {
      return setError("You must agree to the terms and conditions.");
    }

    setLoading(true);
    setError("");

    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        company
      };

      const response = await apiService.register(userData);
      
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          onClick={onClose}
        >
          <MdClose size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
              required
            />
          </div>
          <input
            type="text"
            name="company"
            placeholder="Company (Optional)"
            value={form.company}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white pr-10"
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

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            required
          />

          {/* Password strength BELOW confirm password */}
          {form.password && (
            <p
              className={`text-sm mt-1 font-medium ${getStrengthColor(
                getPasswordStrength(form.password)
              )}`}
            >
              Password Strength: {getPasswordStrength(form.password)}
            </p>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            I agree to the{" "}
            <a
              href="https://www.tupae.co/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="https://www.tupae.co/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Privacy Policy
            </a>
          </label>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold rounded-lg transition duration-300`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onClose}
              className="font-semibold hover:text-gray-800 dark:hover:text-white"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;

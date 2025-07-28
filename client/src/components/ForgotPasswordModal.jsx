// src/components/ForgotPasswordModal.jsx
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Auto-close 3 seconds after success
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          onClick={onClose}
        >
          <MdClose size={20} />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Forgot Password
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Enter your email to receive a password reset link.
            </p>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
            >
              Send Reset Link
            </button>

            {/* Back to login link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={onClose}
                className="font-semibold hover:text-gray-800 dark:hover:text-white"
              >
                ← Back to Login
              </button>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-600 dark:text-green-400">
              We've sent a reset link to your email.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Closing in 3 seconds...
            </p>

            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              ← Back to Login Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;

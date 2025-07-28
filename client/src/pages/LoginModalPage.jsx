// src/pages/LoginModalPage.jsx
import React from "react";
import LoginModal from "../components/LoginModal";

function LoginModalPage({ onLogin }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <LoginModal onLogin={onLogin} />
    </div>
  );
}

export default LoginModalPage;

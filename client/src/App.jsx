// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import AppRoutes from "./routes/Router";
import { ThemeProvider } from "./ThemeContext";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal"; // Optional
import LoginModalPage from "./pages/LoginModalPage";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowSignup(false);
    navigate("/");
  };

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <div className="h-screen w-screen flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <LoginModal
                onLogin={handleLoginSuccess}
                onSignupClick={() => {
                  setShowSignup(true);
                  navigate("/");
                }}
              />
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className={`${!isAuthenticated ? "blur-sm pointer-events-none" : ""}`}>
              <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
                <AppRoutes />
              </Layout>
            </div>
          }
        />
      </Routes>

      {/* Global Sign Up Modal */}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;

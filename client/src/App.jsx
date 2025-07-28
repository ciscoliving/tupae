// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import AppRoutes from "./routes/Router";
import { ThemeProvider } from "./ThemeContext";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  return (
    <>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            <div className="h-screen w-screen flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <LoginModal
                onLogin={handleLoginSuccess}
                onSignupClick={() => navigate("/signup")}
              />
            </div>
          }
        />

        {/* Signup route with same blur */}
        <Route
          path="/signup"
          element={
            <div className="h-screen w-screen flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <SignupModal
                onClose={() => navigate("/login")}
              />
            </div>
          }
        />

        {/* All other routes */}
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

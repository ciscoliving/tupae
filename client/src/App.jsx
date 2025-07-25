// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./layout/Layout";
import AppRoutes from "./routes/Router";
import { ThemeProvider } from "./ThemeContext"; // if you have one

function App() {
  const [isOpen, setIsOpen] = useState(true); // ✅ add this line

  return (
    <ThemeProvider>
      <Router>
        <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
          <AppRoutes />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

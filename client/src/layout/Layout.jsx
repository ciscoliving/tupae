import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex transition-all duration-300">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /> {/* ✅ fixed */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          } flex-1`}
        >
          <main className="overflow-y-auto px-6 py-6 pt-20">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default Layout;

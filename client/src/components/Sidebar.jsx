// src/components/Sidebar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdContentPaste,
  MdPeople,
  MdBarChart,
  MdSettings,
  MdCreate,
  MdPublish,
  MdAccessTime,
  MdOutlineDrafts,
  MdLightMode,
  MdDarkMode,
  MdSwitchAccount,
} from "react-icons/md";

const mockBrands = ["Sixtus Group", "HomeFront Realty", "GTA", "Impacto"];

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const iconSize = 24;

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [theme, setTheme] = useState("light");
  const [selectedBrand, setSelectedBrand] = useState(mockBrands[0]);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const currentPath = location.pathname;
  const didInit = useRef(false);

  // Load from localStorage on first mount
  useEffect(() => {
    if (!didInit.current) {
      const savedSidebar = localStorage.getItem("sidebarOpen");
      if (savedSidebar !== null) {
        setIsOpen(savedSidebar === "true");
      }

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }

      const savedBrand = localStorage.getItem("selectedBrand");
      if (savedBrand) {
        setSelectedBrand(savedBrand);
      }

      didInit.current = true;
    }
  }, [setIsOpen]);

  // Persist sidebar state
  useEffect(() => {
    if (didInit.current) {
      localStorage.setItem("sidebarOpen", isOpen);
    }
  }, [isOpen]);

  // Persist and apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auto-open content dropdown on matching route
  useEffect(() => {
    if (
      currentPath.startsWith("/create-post") ||
      currentPath.startsWith("/published") ||
      currentPath.startsWith("/scheduled-posts") ||
      currentPath.startsWith("/drafts")
    ) {
      setActiveDropdown("content");
    }
  }, [currentPath]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleDropdown = (menu) => {
    if (!isOpen) return;
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleContentClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setActiveDropdown("content");
      navigate("/create-post");
    } else {
      toggleDropdown("content");
    }
  };

  const handleBrandClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setBrandDropdownOpen(true);
    } else {
      setBrandDropdownOpen((prev) => !prev);
    }
  };

  const handleBrandSwitch = (brand) => {
    setSelectedBrand(brand);
    localStorage.setItem("selectedBrand", brand);
    setBrandDropdownOpen(false);
  };

  const linkClass = (path) =>
    `flex items-center gap-2 text-lg font-medium px-2 py-1 rounded-md transition-colors duration-200 ${
      currentPath === path
        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        : "text-gray-800 dark:text-white hover:text-blue-500"
    }`;

  const dropdownLinkClass = (path) =>
    `flex items-center gap-2 px-2 py-1 rounded-md ${
      currentPath === path
        ? "text-blue-600 dark:text-blue-300"
        : "hover:text-blue-500 text-gray-600 dark:text-gray-300"
    }`;

  return (
    <aside
      className={`fixed top-16 left-0 z-10 ${
        isOpen ? "w-64" : "w-20"
      } h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col justify-between transition-all duration-300`}
    >
      <nav className="space-y-4">
        <Link to="/" className={linkClass("/")}>
          <MdDashboard size={iconSize} />
          {isOpen && "Dashboard"}
        </Link>

        <div>
          <button
            onClick={handleContentClick}
            className={`flex items-center gap-2 text-lg font-medium w-full ${
              activeDropdown === "content"
                ? "text-blue-600 dark:text-blue-300"
                : "text-gray-800 dark:text-white hover:text-blue-500"
            }`}
          >
            <MdContentPaste size={iconSize} />
            {isOpen && "Content"}
          </button>

          {isOpen && activeDropdown === "content" && (
            <div className="ml-8 mt-2 space-y-2 text-sm">
              <Link to="/create-post" className={dropdownLinkClass("/create-post")}>
                <MdCreate size={iconSize} /> Create Post
              </Link>
              <Link to="/published" className={dropdownLinkClass("/published")}>
                <MdPublish size={iconSize} /> Published Posts
              </Link>
              <Link to="/scheduled-posts" className={dropdownLinkClass("/scheduled-posts")}>
                <MdAccessTime size={iconSize} /> Scheduled
              </Link>
              <Link to="/drafts" className={dropdownLinkClass("/drafts")}>
                <MdOutlineDrafts size={iconSize} /> Drafts
              </Link>
            </div>
          )}
        </div>

        <Link to="/engagement" className={linkClass("/engagement")}>
          <MdPeople size={iconSize} />
          {isOpen && "Engagement"}
        </Link>

        <Link to="/analytics" className={linkClass("/analytics")}>
          <MdBarChart size={iconSize} />
          {isOpen && "Analytics"}
        </Link>

        <div className="relative">
          <button
            onClick={handleBrandClick}
            className={`flex items-center justify-between gap-2 w-full text-lg font-medium text-left ${
              isOpen
                ? "text-gray-800 dark:text-white hover:text-blue-500"
                : "justify-center"
            }`}
          >
            <MdSwitchAccount size={iconSize} />
            {isOpen && <span className="flex-1 truncate">{selectedBrand}</span>}
          </button>

          {isOpen && brandDropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-700 rounded shadow-lg z-20">
              {mockBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandSwitch(brand)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-600 ${
                    selectedBrand === brand
                      ? "bg-blue-50 dark:bg-gray-600 font-bold"
                      : ""
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/settings" className={linkClass("/settings")}>
          <MdSettings size={iconSize} />
          {isOpen && "Settings"}
        </Link>
      </nav>

      <div className="mt-6">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-white hover:text-blue-500"
        >
          {theme === "dark" ? (
            <MdLightMode size={iconSize} />
          ) : (
            <MdDarkMode size={iconSize} />
          )}
          {isOpen && (theme === "dark" ? "Light Mode" : "Dark Mode")}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
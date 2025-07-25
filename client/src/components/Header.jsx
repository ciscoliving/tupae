// src/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import {
  MdMenu,
  MdClose,
  MdNotificationsNone,
  MdLogout,
  MdPerson,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useOutsideClick } from "../hooks/useOutsideClick"; // optional custom hook to close dropdowns

function Header({ toggleSidebar, sidebarOpen, currentBrand = "Brand A" }) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const avatarRef = useRef();
  const notifRef = useRef();

  useOutsideClick(avatarRef, () => setAvatarOpen(false));
  useOutsideClick(notifRef, () => setNotifOpen(false));

  const dummyNotifications = {
    "Brand A": [
      { id: 1, message: "New like on your Instagram post." },
      { id: 2, message: "New comment on Facebook post." },
      { id: 3, message: "New follower on TikTok." },
    ],
    "Brand B": [
      { id: 1, message: "LinkedIn post received 20 impressions." },
      { id: 2, message: "New YouTube comment." },
    ],
  };

  const currentNotifications = dummyNotifications[currentBrand] || [];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-md">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <MdClose size={20} className="text-gray-800 dark:text-white" />
            ) : (
              <MdMenu size={20} className="text-gray-800 dark:text-white" />
            )}
          </button>
          <h1 className="text-xl font-bold">Tupae</h1>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notification */}
          <div className="relative" ref={notifRef}>
            <button
              title="Notifications"
              className="text-xl relative"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <MdNotificationsNone className="text-gray-600 dark:text-white" />
              {currentNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {currentNotifications.length}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50 p-3 space-y-2">
                <h4 className="text-sm font-bold mb-1">Notifications</h4>
                {currentNotifications.length > 0 ? (
                  currentNotifications.map((notif) => (
                    <div key={notif.id} className="text-sm text-gray-700 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
                      {notif.message}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No new notifications</div>
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="relative" ref={avatarRef}>
            <button onClick={() => setAvatarOpen(!avatarOpen)}>
              <FaUserCircle size={28} className="text-gray-500 dark:text-white" />
            </button>
            {avatarOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg z-50">
                <button className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <MdPerson /> Profile
                </button>
                <button className="w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-500">
                  <MdLogout /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

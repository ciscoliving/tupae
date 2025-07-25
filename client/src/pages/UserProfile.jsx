// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEdit, MdSave } from "react-icons/md";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: "Francisco Kubagwa",
    email: "francisco@example.com",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    // Save logic here
    console.log("Saved profile:", user);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-20 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editMode ? <MdSave /> : <MdEdit />}
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <FaUserCircle size={80} className="text-gray-400 dark:text-white" />
        {editMode && (
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            disabled
          >
            Change Photo (Coming Soon)
          </button>
        )}
      </div>

      <form className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">New Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter new password"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default UserProfile;

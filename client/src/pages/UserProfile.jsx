// src/pages/UserProfile.jsx
import React, { useState, useCallback, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEdit, MdSave } from "react-icons/md";
import { Switch } from "@headlessui/react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import timezones from "../utils/timezones";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [user, setUser] = useState({
    name: "Francisco Kubagwa",
    email: "francisco@example.com",
    password: "",
    currentPassword: "",
    bio: "Creative Director at Sixtus Group Limited",
    role: "Admin",
    twitter: "",
    instagram: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Nairobi",
    theme: localStorage.getItem("theme") || "light",
    notifyPosts: true,
    notifyMessages: true,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (user.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", user.theme);
  }, [user.theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageToCrop(url);
      setCropModalOpen(true);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const cropped = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProfileImage(cropped);
      setCropModalOpen(false);
    } catch (err) {
      console.error("Crop failed:", err);
    }
  };

  const handleSave = () => {
    const tryingToChangePassword = showPasswordFields && user.currentPassword;

    if (tryingToChangePassword) {
      if (user.currentPassword !== "correct-password") {
        alert("Current password is incorrect.");
        return;
      }
      if (!user.password) {
        alert("Please enter a new password.");
        return;
      }
      alert("Password updated successfully.");
    }

    setUser((prev) => ({
      ...prev,
      password: "",
      currentPassword: "",
    }));

    setShowPasswordFields(false);
    setEditMode(false);
    console.log("Saved profile:", user);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-20 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <button
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editMode ? <MdSave /> : <MdEdit />}
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-white"
            />
          ) : (
            <FaUserCircle size={80} className="text-gray-400 dark:text-white" />
          )}
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="mt-2 block text-sm text-gray-500 dark:text-gray-300"
            />
          )}
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
        </div>
      </div>

      {cropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md relative">
            <div className="w-full h-60 relative">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setCropModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleCropSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

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

        {editMode && !showPasswordFields && (
          <button
            type="button"
            onClick={() => setShowPasswordFields(true)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Change Password
          </button>
        )}

        {editMode && showPasswordFields && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={user.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-2 text-sm text-blue-600"
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-2 text-sm text-blue-600"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Instagram Handle</label>
            <input
              type="text"
              name="instagram"
              value={user.instagram}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="@yourhandle"
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Twitter Handle</label>
            <input
              type="text"
              name="twitter"
              value={user.twitter}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="@yourhandle"
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Timezone</label>
            <select
              name="timezone"
              value={user.timezone}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Theme Preference</label>
            <select
              name="theme"
              value={user.theme}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2 mt-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Notify on new messages</span>
              <Switch
                checked={user.notifyMessages}
                onChange={(value) => setUser((prev) => ({ ...prev, notifyMessages: value }))}
                className={`${user.notifyMessages ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${user.notifyMessages ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            <div className="flex items-center justify-between">
              <span>Notify on post status updates</span>
              <Switch
                checked={user.notifyPosts}
                onChange={(value) => setUser((prev) => ({ ...prev, notifyPosts: value }))}
                className={`${user.notifyPosts ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${user.notifyPosts ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;

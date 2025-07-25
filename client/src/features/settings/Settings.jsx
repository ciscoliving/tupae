// src/features/settings/Settings.jsx
import React, { useState } from "react";
import {
  FiUser,
  FiBell,
  FiSettings,
  FiTrash2,
  FiPlus,
  FiUsers,
  FiEdit3,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import Modal from "../../components/ui/Modal";

const Settings = () => {
  const [tab, setTab] = useState("account");
  const [profile, setProfile] = useState({
    name: "Francisco Kubagwa",
    email: "francisco@sixtus.co.tz",
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
  });
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [brands, setBrands] = useState([
    {
      name: "Sixtus Group",
      connectedAccounts: ["facebook", "instagram"],
    },
  ]);
  const [team, setTeam] = useState([
    { name: "Hawa Japhary", role: "Manager", email: "hawa@sixtus.co.tz" },
  ]);

  const platformIcons = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedin />,
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    // auto-save simulated
    console.log("Saved", { ...notifications, [key]: !notifications[key] });
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    const form = e.target;
    const newBrand = {
      name: form.brandName.value,
      connectedAccounts: ["facebook"], // simulate one for now
    };
    setBrands([...brands, newBrand]);
    setShowAddBrandForm(false);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    const form = e.target;
    const newMember = {
      name: form.name.value,
      email: form.email.value,
      role: form.role.value,
    };
    setTeam([...team, newMember]);
    setShowInviteForm(false);
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    const form = e.target;
    const password = form.password.value;
    if (password === "admin123") {
      alert("Account deleted. All data will be removed.");
      // Simulate deletion
      window.location.href = "/";
    } else {
      alert("Incorrect password.");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 text-sm font-medium">
        <button onClick={() => setTab("account")} className={`px-4 py-2 rounded ${tab === "account" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"}`}>
          <FiUser className="inline-block mr-2" /> Account
        </button>
        <button onClick={() => setTab("notifications")} className={`px-4 py-2 rounded ${tab === "notifications" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"}`}>
          <FiBell className="inline-block mr-2" /> Notifications
        </button>
        <button onClick={() => setTab("brand")} className={`px-4 py-2 rounded ${tab === "brand" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"}`}>
          <FiSettings className="inline-block mr-2" /> Brand Settings
        </button>
        <button onClick={() => setTab("team")} className={`px-4 py-2 rounded ${tab === "team" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"}`}>
          <FiUsers className="inline-block mr-2" /> Team Management
        </button>
      </div>

      {/* Account */}
      {tab === "account" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-bold">Profile Info</h3>
          <div className="space-y-2">
            <input
              className="w-full p-2 border rounded dark:bg-gray-700"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              className="w-full p-2 border rounded dark:bg-gray-700"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          </div>
          <hr className="my-4" />
          <button
            onClick={() => setShowDeleteForm(true)}
            className="text-red-600 flex items-center gap-2"
          >
            <FiTrash2 /> Delete Account
          </button>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-bold">Notification Settings</h3>
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleToggleNotification(key)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Brand Settings */}
      {tab === "brand" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Brands</h3>
            <button onClick={() => setShowAddBrandForm(true)} className="text-blue-600 flex items-center gap-1">
              <FiPlus /> Add Brand
            </button>
          </div>
          <ul className="space-y-3">
            {brands.map((b, i) => (
              <li key={i} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-bold">{b.name}</div>
                  <div className="text-sm text-gray-500 flex gap-2 mt-1">
                    {b.connectedAccounts.map((acc, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        {platformIcons[acc]}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Team Management */}
      {tab === "team" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Team Members</h3>
            <button onClick={() => setShowInviteForm(true)} className="text-blue-600 flex items-center gap-1">
              <FiPlus /> Invite
            </button>
          </div>
          <ul className="space-y-3">
            {team.map((member, i) => (
              <li key={i} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-bold">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role} — {member.email}</div>
                </div>
                <button onClick={() => setTeam(team.filter((_, idx) => idx !== i))} className="text-red-600">
                  <FiX />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteForm} onClose={() => setShowDeleteForm(false)} title="Delete Account">
        <form onSubmit={handleDeleteAccount} className="space-y-4">
          <p className="text-red-600">It breaks our heart to see you leave 😢</p>
          <p>Are you sure you want to delete your account? This action is irreversible.</p>
          <input
            name="password"
            type="password"
            required
            placeholder="Enter password to confirm"
            className="w-full border rounded p-2"
          />
          <button type="submit" className="w-full bg-red-600 text-white p-2 rounded">Delete Account</button>
        </form>
      </Modal>

      {/* Add Brand Modal */}
      <Modal isOpen={showAddBrandForm} onClose={() => setShowAddBrandForm(false)} title="Add Brand">
        <form onSubmit={handleAddBrand} className="space-y-4">
          <input name="brandName" required placeholder="Brand Name" className="w-full border rounded p-2" />
          <p className="text-sm text-gray-500">Connect social media accounts (simulate)</p>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create Brand</button>
        </form>
      </Modal>

      {/* Invite Team Member Modal */}
      <Modal isOpen={showInviteForm} onClose={() => setShowInviteForm(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <input name="name" required placeholder="Full Name" className="w-full border rounded p-2" />
          <input name="email" type="email" required placeholder="Email" className="w-full border rounded p-2" />
          <select name="role" required className="w-full border rounded p-2">
            <option value="Editor">Editor</option>
            <option value="Manager">Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Send Invite</button>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;

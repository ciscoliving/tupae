// src/features/settings/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  FiBell,
  FiSettings,
  FiPlus,
  FiUsers,
  FiX,
  FiEdit3,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedin, FaPlus } from "react-icons/fa";
import Modal from "../../components/ui/Modal";

const Settings = () => {
  const [tab, setTab] = useState("notifications");
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
  });
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [brands, setBrands] = useState([]);
  const [team, setTeam] = useState([]);

  const platformIcons = {
    facebook: { icon: <FaFacebookF />, logo: "/fb-logo.png" },
    instagram: { icon: <FaInstagram />, logo: "/ig-logo.png" },
    linkedin: { icon: <FaLinkedin />, logo: "/li-logo.png" },
  };

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedBrands = localStorage.getItem("tupae_brands");
    const savedTeam = localStorage.getItem("tupae_team");

    if (savedBrands) {
      setBrands(JSON.parse(savedBrands));
    } else {
      // Default brand
      setBrands([
        {
          name: "Sixtus Group",
          connectedAccounts: ["facebook", "instagram"],
          editing: false,
          teamMembers: ["hawa@sixtus.co.tz", "fran@sixtus.co.tz"],
        },
      ]);
    }

    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    } else {
      // Default team
      setTeam([
        { name: "Hawa Japhary", email: "hawa@sixtus.co.tz" },
        { name: "Francisco Kubagwa", email: "fran@sixtus.co.tz" },
      ]);
    }
  }, []);

  // Save brands to localStorage
  useEffect(() => {
    localStorage.setItem("tupae_brands", JSON.stringify(brands));
  }, [brands]);

  // Save team to localStorage
  useEffect(() => {
    localStorage.setItem("tupae_team", JSON.stringify(team));
  }, [team]);

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    const form = e.target;
    const newBrand = {
      name: form.brandName.value,
      connectedAccounts: [],
      editing: false,
      teamMembers: [],
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
    };
    setTeam([...team, newMember]);
    setShowInviteForm(false);
  };

  const toggleEditBrand = (index) => {
    const updated = [...brands];
    updated[index].editing = !updated[index].editing;
    setBrands(updated);
  };

  const saveBrandName = (index, newName) => {
    const updated = [...brands];
    updated[index].name = newName;
    updated[index].editing = false;
    setBrands(updated);
  };

  const removeBrand = (index) => {
    if (window.confirm("Are you sure you want to remove this brand?")) {
      const updated = brands.filter((_, i) => i !== index);
      setBrands(updated);
    }
  };

  const connectSocialAccount = (index, platform) => {
    const updated = [...brands];
    if (!updated[index].connectedAccounts.includes(platform)) {
      updated[index].connectedAccounts.push(platform);
      setBrands(updated);
    }
  };

  const assignMemberToBrand = (brandIndex, email) => {
    const updated = [...brands];
    const already = updated[brandIndex].teamMembers.includes(email);
    if (!already) {
      updated[brandIndex].teamMembers.push(email);
      setBrands(updated);
    }
  };

  const removeMemberFromBrand = (brandIndex, email) => {
    const updated = [...brands];
    updated[brandIndex].teamMembers = updated[brandIndex].teamMembers.filter((e) => e !== email);
    setBrands(updated);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 text-sm font-medium">
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Brands</h3>
            <button onClick={() => setShowAddBrandForm(true)} className="text-blue-600 flex items-center gap-1">
              <FiPlus /> Add Brand
            </button>
          </div>

          {brands.map((brand, i) => {
            const logoPlatform = brand.connectedAccounts[0];
            const logo = logoPlatform ? platformIcons[logoPlatform].logo : null;

            return (
              <div key={i} className="border rounded p-4 space-y-4">
                <div className="flex items-center gap-4">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">N/A</div>
                  )}
                  <div className="flex-1">
                    {brand.editing ? (
                      <input
                        defaultValue={brand.name}
                        onChange={(e) => (brand.tempName = e.target.value)}
                        className="p-2 border rounded w-full dark:bg-gray-700"
                      />
                    ) : (
                      <h4 className="text-lg font-bold">{brand.name}</h4>
                    )}
                  </div>
                  {brand.editing ? (
                    <>
                      <button onClick={() => saveBrandName(i, brand.tempName || brand.name)} className="text-green-600">
                        <FiSave />
                      </button>
                      <button onClick={() => toggleEditBrand(i)} className="text-gray-400">
                        <FiX />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => toggleEditBrand(i)} className="text-blue-500">
                        <FiEdit3 />
                      </button>
                      <button onClick={() => removeBrand(i)} className="text-red-600">
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>

                {/* Connected Accounts */}
                <div className="flex gap-2 flex-wrap">
                  {brand.connectedAccounts.map((acc, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {platformIcons[acc].icon} {acc}
                    </span>
                  ))}
                  {["facebook", "instagram", "linkedin"].map(
                    (platform) =>
                      !brand.connectedAccounts.includes(platform) && (
                        <button
                          key={platform}
                          onClick={() => connectSocialAccount(i, platform)}
                          className="text-sm px-2 py-1 border rounded flex items-center gap-1"
                        >
                          <FaPlus /> Connect {platform}
                        </button>
                      )
                  )}
                </div>

                {/* Team Members */}
                <div>
                  <h4 className="text-md font-semibold mt-4 mb-2">Team Members (All Managers)</h4>
                  <ul className="space-y-2">
                    {brand.teamMembers.map((email, idx) => {
                      const user = team.find((m) => m.email === email);
                      return (
                        <li key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                          <span>{user?.name || email}</span>
                          <button
                            onClick={() => removeMemberFromBrand(i, email)}
                            className="text-red-500"
                          >
                            <FiX />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <select
                    onChange={(e) => {
                      const email = e.target.value;
                      if (email) {
                        assignMemberToBrand(i, email);
                        e.target.value = "";
                      }
                    }}
                    className="w-full p-2 border rounded mt-2"
                  >
                    <option value="">Assign new member...</option>
                    {team.map((member) => {
                      const alreadyAssigned = brand.teamMembers.includes(member.email);
                      if (alreadyAssigned) return null;
                      return (
                        <option key={member.email} value={member.email}>
                          {member.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            );
          })}
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
                  <div className="text-sm text-gray-500">Manager — {member.email}</div>
                </div>
                <button onClick={() => setTeam(team.filter((_, idx) => idx !== i))} className="text-red-600">
                  <FiX />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAddBrandForm} onClose={() => setShowAddBrandForm(false)} title="Add Brand">
        <form onSubmit={handleAddBrand} className="space-y-4">
          <input name="brandName" required placeholder="Brand Name" className="w-full border rounded p-2" />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create Brand</button>
        </form>
      </Modal>

      <Modal isOpen={showInviteForm} onClose={() => setShowInviteForm(false)} title="Invite Team Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <input name="name" required placeholder="Full Name" className="w-full border rounded p-2" />
          <input name="email" type="email" required placeholder="Email" className="w-full border rounded p-2" />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Send Invite</button>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;

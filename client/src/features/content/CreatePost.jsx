// src/features/content/CreatePost.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
import {
  MdOutlineCloudUpload,
  MdAdd,
  MdClose,
  MdArrowBackIos,
  MdArrowForwardIos,
} from "react-icons/md";
import { format, addHours, isBefore } from "date-fns";

const platforms = [
  { name: "Facebook", icon: <FaFacebookF />, value: "facebook" },
  { name: "Instagram", icon: <FaInstagram />, value: "instagram" },
  { name: "X", icon: <FaXTwitter />, value: "x" },
  { name: "YouTube", icon: <FaYoutube />, value: "youtube" },
  { name: "TikTok", icon: <FaTiktok />, value: "tiktok" },
];

function CreatePost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [shareToStory, setShareToStory] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(0);
  const [showScheduleFields, setShowScheduleFields] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [scheduleTime, setScheduleTime] = useState(
    format(addHours(new Date(), 1), "HH:00")
  );
  const [scheduleError, setScheduleError] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleAddMedia = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    const readers = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ src: reader.result, file });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newMedia) => {
      setMediaFiles((prev) => [...prev, ...newMedia]);
    });
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    if (currentPreview >= mediaFiles.length - 1) {
      setCurrentPreview(Math.max(0, mediaFiles.length - 2));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("mediaIndex", index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("mediaIndex");
    if (draggedIndex !== null) {
      const updatedMedia = [...mediaFiles];
      const [moved] = updatedMedia.splice(draggedIndex, 1);
      updatedMedia.splice(index, 0, moved);
      setMediaFiles(updatedMedia);
    }
  };

  const validateSchedule = () => {
    const combined = new Date(`${scheduleDate}T${scheduleTime}`);
    const now = new Date();
    if (isBefore(combined, addHours(now, 1))) {
      setScheduleError("Scheduled time must be at least 1 hour from now.");
      return false;
    }
    setScheduleError("");
    return true;
  };

  const clearSchedule = () => {
    setScheduleDate(format(new Date(), "yyyy-MM-dd"));
    setScheduleTime(format(addHours(new Date(), 1), "HH:00"));
    setShowScheduleFields(false);
    setScheduleError("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-4 overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-2/3 space-y-6 min-w-0">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create Post</h2>

        {/* Platform Selection */}
        <div>
          <p className="font-medium mb-2">Post to</p>
          <div className="flex flex-wrap gap-3">
            {platforms.map(({ name, icon, value }) => (
              <button
                key={value}
                onClick={() => handlePlatformToggle(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
                  selectedPlatforms.includes(value)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                {icon} {name}
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <div className="flex flex-wrap gap-4">
          {mediaFiles.map((media, index) => (
            <div
              key={index}
              className="relative w-28 h-28 border rounded overflow-hidden"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={(e) => e.preventDefault()}
            >
              {media.file.type.startsWith("image") ? (
                <img src={media.src} alt={`media-${index}`} className="w-full h-full object-cover" />
              ) : (
                <video src={media.src} className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => handleRemoveMedia(index)}
                className="absolute top-0 right-0 bg-black bg-opacity-70 text-white p-1 rounded-bl"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-28 h-28 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:text-blue-500 dark:border-gray-600 dark:text-gray-200"
          >
            <MdAdd size={32} />
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleAddMedia}
              className="hidden"
              ref={fileInputRef}
            />
          </button>
        </div>

        {/* Caption */}
        <div>
          <label className="block font-medium mb-1">Caption</label>
          <textarea
            rows={4}
            className="w-full border p-3 rounded-lg dark:bg-gray-900 dark:text-white resize-none overflow-y-auto max-h-48 break-all"
            placeholder="Write your caption here..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Share to Story */}
        <div className="flex items-center">
          <input
            id="storyToggle"
            type="checkbox"
            checked={shareToStory}
            onChange={() => setShareToStory(!shareToStory)}
            className="mr-2"
          />
          <label htmlFor="storyToggle" className="text-sm font-medium">Share to Story</label>
        </div>

        {/* Scheduling */}
        {showScheduleFields && (
          <div className="space-y-3 pt-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full border p-2 rounded dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Set Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full border p-2 rounded dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
            {scheduleError && (
              <p className="text-sm text-red-500">{scheduleError}</p>
            )}
            <button
              onClick={clearSchedule}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear Schedule
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm">
              Save as Draft
            </button>
            <button
              onClick={() => setShowScheduleFields(true)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm"
            >
              {showScheduleFields ? "Reschedule" : "Schedule"}
            </button>
            <button
              onClick={validateSchedule}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              {showScheduleFields ? "Schedule Now" : "Publish Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Section (Preview) */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Post Preview</h3>
        <div className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800 border dark:border-gray-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Your Brand</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>

          {mediaFiles.length > 0 && (
            <div className="relative mb-3">
              {mediaFiles[currentPreview].file.type.startsWith("image") ? (
                <img src={mediaFiles[currentPreview].src} alt="Preview" className="w-full rounded" />
              ) : (
                <video src={mediaFiles[currentPreview].src} className="w-full rounded" controls />
              )}
              {mediaFiles.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentPreview((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1))
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-1"
                  >
                    <MdArrowBackIos size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPreview((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-1"
                  >
                    <MdArrowForwardIos size={20} />
                  </button>
                </>
              )}
            </div>
          )}

          <div className="text-sm dark:text-white break-all max-h-32 overflow-auto whitespace-pre-wrap">
            {caption || "Your caption will appear here..."}
          </div>

          <div className="flex justify-between mt-4 text-gray-500 text-sm pt-2 border-t dark:border-gray-700">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>↗ Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

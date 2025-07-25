import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
import { format } from "date-fns";

const allPlatforms = [
  { name: "Facebook", icon: <FaFacebookF />, value: "facebook" },
  { name: "Instagram", icon: <FaInstagram />, value: "instagram" },
  { name: "X", icon: <FaXTwitter />, value: "x" },
  { name: "YouTube", icon: <FaYoutube />, value: "youtube" },
  { name: "TikTok", icon: <FaTiktok />, value: "tiktok" },
];

// Dummy scheduled posts
const generateScheduledPosts = () => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    caption: `Scheduled post ${i + 1}`,
    platforms: ["facebook", "instagram"],
    scheduledAt: new Date(Date.now() + i * 3600000 * 24),
    media: i % 2 === 0
      ? { type: "image", src: `https://picsum.photos/seed/${i}/400/300` }
      : { type: "video", src: "/demo-video.mp4" },
  }));
};

const ScheduledPosts = () => {
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const allPosts = useRef(generateScheduledPosts());

  const filteredPosts = allPosts.current
    .filter((post) =>
      searchTerm ? post.caption.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter((post) =>
      selectedPlatform ? post.platforms.includes(selectedPlatform) : true
    )
    .filter((post) =>
      dateFrom ? new Date(post.scheduledAt) >= new Date(dateFrom) : true
    )
    .filter((post) =>
      dateTo ? new Date(post.scheduledAt) <= new Date(dateTo) : true
    );

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setVisibleCount((prev) => prev + 6);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Scheduled Posts
        </h1>
        <button
          onClick={() => navigate("/create-post")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
        >
          + Create Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search caption..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        />
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Platforms</option>
          {allPlatforms.map((p) => (
            <option key={p.value} value={p.value}>{p.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-52">
              {post.media.type === "image" ? (
                <img src={post.media.src} alt="media" className="w-full h-full object-cover" />
              ) : (
                <video src={post.media.src} className="w-full h-full object-cover" controls />
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                {post.platforms.map((p) => {
                  const platform = allPlatforms.find((pl) => pl.value === p);
                  return (
                    <span
                      key={p}
                      className="flex items-center gap-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded-full"
                    >
                      {platform.icon} {platform.name}
                    </span>
                  );
                })}
              </div>
              <p className="text-sm text-gray-800 dark:text-white">{post.caption}</p>
              <p className="text-xs text-gray-500">
                Scheduled for {format(new Date(post.scheduledAt), "dd MMM yyyy, hh:mm a")}
              </p>

              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t dark:border-gray-700 mt-2">
                <button className="hover:text-blue-600">✏️ Edit</button>
                <button className="hover:text-yellow-600">⏰ Reschedule</button>
                <button className="hover:text-orange-600">❌ Cancel</button>
                <button className="hover:text-red-600">🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {visiblePosts.length < filteredPosts.length && (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          Loading more scheduled posts...
        </div>
      )}
    </div>
  );
};

export default ScheduledPosts;

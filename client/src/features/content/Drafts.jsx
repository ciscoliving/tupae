// src/features/content/Drafts.jsx
import React, { useEffect, useRef, useState } from "react";
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

// Dummy data
const generateDummyDrafts = () => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    caption: `Draft post #${i + 1}`,
    platforms: ["instagram", "facebook"],
    date: new Date(Date.now() - i * 100000000),
    media: i % 2 === 0
      ? { type: "image", src: `https://picsum.photos/seed/draft${i}/400/300` }
      : { type: "video", src: "/demo-video.mp4" },
  }));
};

function Drafts() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const allDrafts = useRef(generateDummyDrafts());

  const filtered = allDrafts.current
    .filter((post) =>
      searchTerm ? post.caption.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter((post) =>
      platformFilter ? post.platforms.includes(platformFilter) : true
    )
    .filter((post) =>
      dateFrom ? new Date(post.date) >= new Date(dateFrom) : true
    )
    .filter((post) =>
      dateTo ? new Date(post.date) <= new Date(dateTo) : true
    );

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (bottom) setVisibleCount((prev) => prev + 6);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Drafts
        </h2>
        <button
          onClick={() => navigate("/create-post")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
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
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Platforms</option>
          {allPlatforms.map((p) => (
            <option key={p.value} value={p.value}>
              {p.name}
            </option>
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

      {/* Grid of Drafts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-52">
              {post.media.type === "image" ? (
                <img
                  src={post.media.src}
                  alt="media"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={post.media.src}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                {post.platforms.map((p) => {
                  const plat = allPlatforms.find((pl) => pl.value === p);
                  return (
                    <span
                      key={p}
                      className="flex items-center gap-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded-full"
                    >
                      {plat.icon} {plat.name}
                    </span>
                  );
                })}
              </div>
              <p className="text-sm text-gray-800 dark:text-white">{post.caption}</p>
              <p className="text-xs text-gray-500">
                Created: {format(new Date(post.date), "dd MMM yyyy")}
              </p>

              {/* Dummy actions */}
              <div className="flex justify-between text-xs pt-2 border-t dark:border-gray-700">
                <button className="text-blue-600 dark:text-blue-400">✏️ Edit</button>
                <button className="text-green-600 dark:text-green-400">🚀 Publish</button>
                <button className="text-red-600 dark:text-red-400">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length < filtered.length && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
          Loading more drafts...
        </div>
      )}
    </div>
  );
}

export default Drafts;

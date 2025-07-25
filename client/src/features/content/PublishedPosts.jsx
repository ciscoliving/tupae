// src/features/content/PublishedPosts.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
import { MdClose, MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { format } from "date-fns";

const allPlatforms = [
  { name: "Facebook", icon: <FaFacebookF />, value: "facebook" },
  { name: "Instagram", icon: <FaInstagram />, value: "instagram" },
  { name: "X", icon: <FaXTwitter />, value: "x" },
  { name: "YouTube", icon: <FaYoutube />, value: "youtube" },
  { name: "TikTok", icon: <FaTiktok />, value: "tiktok" },
];

const postTypes = ["Reel", "Story", "Image", "Video", "Post"];

// Dummy static post data
const generateDummyPosts = () =>
  Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    caption: `This is post number ${i + 1}`,
    platforms: ["facebook", "instagram"],
    date: new Date(Date.now() - i * 86400000),
    postType: postTypes[i % postTypes.length],
    media:
      i % 3 === 0
        ? { type: "video", src: "/demo-video.mp4" }
        : { type: "image", src: `https://picsum.photos/seed/${i}/400/300` },
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
  }));

const PublishedPosts = () => {
  const navigate = useNavigate();

  const [posts] = useState(generateDummyPosts());
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewPost, setViewPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [deletedPosts, setDeletedPosts] = useState([]);

  const filteredPosts = posts
    .filter((p) => !deletedPosts.includes(p.id))
    .filter((p) =>
      searchTerm ? p.caption.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter((p) => (selectedPlatform ? p.platforms.includes(selectedPlatform) : true))
    .filter((p) => (selectedType ? p.postType === selectedType : true))
    .filter((p) => (dateFrom ? new Date(p.date) >= new Date(dateFrom) : true))
    .filter((p) => (dateTo ? new Date(p.date) <= new Date(dateTo) : true));

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    const onScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (bottom) setVisibleCount((prev) => prev + 6);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeletedPosts((prev) => [...prev, id]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Published Posts
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
          placeholder="Search by caption..."
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
            <option key={p.value} value={p.value}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Types</option>
          {postTypes.map((t) => (
            <option key={t} value={t}>
              {t}
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md overflow-hidden relative"
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
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white rounded-full">
                  {post.postType}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-white">{post.caption}</p>
              <p className="text-xs text-gray-500">
                Posted on {format(new Date(post.date), "dd MMM yyyy")}
              </p>
              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t dark:border-gray-700">
                <span>👍 {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>

              <div className="flex gap-3 pt-3 text-gray-600 dark:text-gray-300">
                <button onClick={() => setViewPost(post)}>
                  <MdVisibility size={18} />
                </button>
                <button onClick={() => setEditPost(post)}>
                  <MdEdit size={18} />
                </button>
                <button onClick={() => handleDelete(post.id)}>
                  <MdDelete size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visiblePosts.length < filteredPosts.length && (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          Loading more posts...
        </div>
      )}

      {/* View Popup */}
      {viewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setViewPost(null)}
            >
              <MdClose size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 dark:text-white">View Post</h2>
            {viewPost.media.type === "image" ? (
              <img src={viewPost.media.src} alt="view" className="w-full mb-4" />
            ) : (
              <video src={viewPost.media.src} className="w-full mb-4" controls />
            )}
            <p className="text-sm dark:text-white">{viewPost.caption}</p>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {editPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setEditPost(null)}
            >
              <MdClose size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Edit Post (Dummy)</h2>
            <textarea
              rows={4}
              className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
              defaultValue={editPost.caption}
            />
            <button
              onClick={() => setEditPost(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishedPosts;

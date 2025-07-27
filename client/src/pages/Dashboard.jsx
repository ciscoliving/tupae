import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  FaUsers,
  FaHeart,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaComment,
  FaShare,
} from "react-icons/fa";

function Dashboard() {
  const engagementChartRef = useRef(null);
  const demographicsChartRef = useRef(null);

  useEffect(() => {
    if (engagementChartRef.current) {
      const chart = new Chart(engagementChartRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Likes",
              data: [1200, 1900, 1700, 2100, 2300, 2500, 2800],
              borderColor: "#6366f1",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Comments",
              data: [300, 500, 450, 600, 700, 650, 800],
              borderColor: "#8b5cf6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });

      return () => chart.destroy();
    }
  }, []);

  useEffect(() => {
    if (demographicsChartRef.current) {
      const chart = new Chart(demographicsChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
          datasets: [
            {
              data: [15, 35, 25, 15, 10],
              backgroundColor: [
                "#6366f1",
                "#8b5cf6",
                "#a855f7",
                "#d946ef",
                "#ec4899",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "right" } },
        },
      });

      return () => chart.destroy();
    }
  }, []);

  const metrics = [
    {
      title: "Total Followers",
      value: "42,856",
      change: "+3.2%",
      icon: <FaUsers className="text-xl" />,
      bg: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Engagement Rate",
      value: "6.8%",
      change: "+1.4%",
      icon: <FaHeart className="text-xl" />,
      bg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Scheduled Posts",
      value: "8",
      change: "+2 active",
      icon: <FaClock className="text-xl" />,
      bg: "bg-blue-100 text-blue-600",
    },
    {
      title: "New Messages",
      value: "12",
      change: "+3 unread",
      icon: <FaEnvelope className="text-xl" />,
      bg: "bg-green-100 text-green-600",
    },
  ];

  const postData = [
    {
      id: 1,
      platform: ["Facebook", "Instagram"],
      time: "2 hours ago",
      text: "Check out our new product line! #NewArrivals #Fashion",
      media: [
        "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3",
      ],
      likes: 245,
      comments: 32,
      shares: 18,
    },
    {
      id: 2,
      platform: ["Twitter"],
      time: "5 hours ago",
      text: "Join our webinar on social media trends for 2023.",
      media: [],
      likes: 189,
      comments: 24,
      shares: 12,
    },
    {
      id: 3,
      platform: ["Instagram"],
      time: "1 day ago",
      text: "Behind the scenes! 📸✨",
      media: [
        "https://images.unsplash.com/photo-1502767089025-6572583495b0",
        "https://images.unsplash.com/photo-1535242208474-9a2793260b1f",
      ],
      likes: 312,
      comments: 45,
      shares: 28,
    },
  ];

  const scheduleItems = [
    {
      title: "Product Launch Announcement",
      platforms: "Instagram, Twitter",
      time: "9:00 AM",
      label: "Tomorrow",
      color: "blue-500",
    },
    {
      title: "Weekly Blog Post: Social Tips",
      platforms: "Facebook, LinkedIn",
      time: "11:30 AM",
      label: "In 3 days",
      color: "pink-500",
    },
    {
      title: "Customer Success Story",
      platforms: "Instagram, Facebook",
      time: "2:00 PM",
      label: "In 5 days",
      color: "blue-400",
    },
    {
      title: "Team Member Spotlight",
      platforms: "LinkedIn",
      time: "10:00 AM",
      label: "Next Week",
      color: "blue-700",
    },
  ];

  return (
    <div className="p-10 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 shadow rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-green-500">{item.change}</p>
              </div>
              <div className={`p-3 rounded-full ${item.bg}`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Engagement Analytics</h3>
            <select className="text-sm border rounded px-2 py-1">
              <option>Last 7 days</option>
              <option selected>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-72">
            <canvas ref={engagementChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Audience Demographics</h3>
            <select className="text-sm border rounded px-2 py-1">
              <option selected>Age</option>
              <option>Gender</option>
              <option>Location</option>
            </select>
          </div>
          <div className="h-72">
            <canvas ref={demographicsChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Posts</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postData.map((post) => {
            const [mediaIndex, setMediaIndex] = useState(0);
            const hasMultiple = post.media.length > 1;

            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  {post.platform.includes("Facebook") && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                      <FaFacebookF className="text-white text-sm" />
                    </div>
                  )}
                  {post.platform.includes("Instagram") && (
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center mr-2">
                      <FaInstagram className="text-white text-sm" />
                    </div>
                  )}
                  {post.platform.includes("Twitter") && (
                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-2">
                      <FaTwitter className="text-white text-sm" />
                    </div>
                  )}
                  <span className="font-medium">{post.platform.join(", ")}</span>
                  <span className="ml-auto text-sm text-gray-500">{post.time}</span>
                </div>

                <p className="text-gray-700 mb-3 text-sm">{post.text}</p>

                {post.media.length > 0 && (
                  <div className="relative mb-3">
                    <img
                      src={post.media[mediaIndex]}
                      alt="carousel"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {hasMultiple && (
                      <>
                        <button
                          onClick={() =>
                            setMediaIndex((prev) =>
                              prev === 0 ? post.media.length - 1 : prev - 1
                            )
                          }
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() =>
                            setMediaIndex((prev) =>
                              prev === post.media.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                )}

                <div className="flex space-x-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-blue-500" /> {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaShare className="text-green-500" /> {post.shares}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Upcoming Schedule</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">Add New</button>
        </div>

        <div className="space-y-4 text-sm">
          {scheduleItems.map((item, i) => (
            <div key={i} className={`border-l-4 border-${item.color} pl-4 py-2`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-500">{item.platforms}</p>
                </div>
                <span className={`text-xs bg-${item.color}/10 text-${item.color} px-2 py-1 rounded-full`}>
                  {item.label}
                </span>
              </div>
              <p className="text-sm mt-1">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}

export default Dashboard;

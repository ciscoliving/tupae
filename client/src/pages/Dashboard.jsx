import {
  MdSchedule,
  MdEqualizer,
  MdPublish,
} from "react-icons/md";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaTiktok,
  FaYoutube,
  FaThumbsUp,
  FaCommentDots,
} from "react-icons/fa6";
import {
  BarChart,
  LineChart,
  AreaChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const dashboardData = [
  {
    title: "Scheduled Posts",
    value: 24,
    icon: <MdSchedule size={30} />,
    bg: "bg-blue-100 dark:bg-blue-900",
    tooltip: "Posts planned to be published later",
  },
  {
    title: "Engagement Rate",
    value: "6.2%",
    icon: <MdEqualizer size={30} />,
    bg: "bg-green-100 dark:bg-green-900",
    tooltip: "Percentage of users interacting with content",
  },
  {
    title: "Published Posts",
    value: 102,
    icon: <MdPublish size={30} />,
    bg: "bg-purple-100 dark:bg-purple-900",
    tooltip: "Total posts already published",
  },
  {
    title: "Impressions",
    value: "12.4K",
    icon: <MdEqualizer size={30} />,
    bg: "bg-orange-100 dark:bg-orange-900",
    tooltip: "Total views across all posts",
  },
];

const platformIcons = {
  Instagram: <FaInstagram className="text-pink-500" />,
  Facebook: <FaFacebook className="text-blue-600" />,
  X: <FaXTwitter className="text-black dark:text-white" />,
  TikTok: <FaTiktok className="text-gray-800 dark:text-white" />,
  YouTube: <FaYoutube className="text-red-600" />,
  Overview: null,
};

const platforms = ["Overview", "Instagram", "Facebook", "X", "TikTok", "YouTube"];
const chartTypes = ["Bar", "Line", "Area"];

const chartDataByPlatform = {
  Instagram: [
    { day: "Mon", Reels: 2, Image: 1, Carousel: 1 },
    { day: "Tue", Reels: 3, Image: 2, Carousel: 2 },
    { day: "Wed", Reels: 1, Image: 1, Carousel: 1 },
    { day: "Thu", Reels: 2, Image: 2, Carousel: 2 },
    { day: "Fri", Reels: 1, Image: 2, Carousel: 2 },
    { day: "Sat", Reels: 0, Image: 1, Carousel: 1 },
    { day: "Sun", Reels: 1, Image: 1, Carousel: 0 },
  ],
  Facebook: [
    { day: "Mon", Reels: 0, Image: 2, Carousel: 0 },
    { day: "Tue", Reels: 1, Image: 2, Carousel: 1 },
    { day: "Wed", Reels: 0, Image: 2, Carousel: 2 },
    { day: "Thu", Reels: 1, Image: 1, Carousel: 1 },
    { day: "Fri", Reels: 1, Image: 0, Carousel: 2 },
    { day: "Sat", Reels: 0, Image: 1, Carousel: 0 },
    { day: "Sun", Reels: 0, Image: 1, Carousel: 0 },
  ],
  X: [
    { day: "Mon", Reels: 0, Image: 1, Carousel: 0 },
    { day: "Tue", Reels: 0, Image: 2, Carousel: 0 },
    { day: "Wed", Reels: 0, Image: 2, Carousel: 0 },
    { day: "Thu", Reels: 0, Image: 2, Carousel: 1 },
    { day: "Fri", Reels: 0, Image: 3, Carousel: 1 },
    { day: "Sat", Reels: 0, Image: 1, Carousel: 0 },
    { day: "Sun", Reels: 0, Image: 1, Carousel: 0 },
  ],
  TikTok: [
    { day: "Mon", Reels: 1 },
    { day: "Tue", Reels: 1 },
    { day: "Wed", Reels: 2 },
    { day: "Thu", Reels: 1 },
    { day: "Fri", Reels: 1 },
    { day: "Sat", Reels: 0 },
    { day: "Sun", Reels: 1 },
  ],
  YouTube: [
    { day: "Mon", Videos: 2, Shorts: 1, Posts: 1 },
    { day: "Tue", Videos: 1, Shorts: 2, Posts: 0 },
    { day: "Wed", Videos: 2, Shorts: 1, Posts: 1 },
    { day: "Thu", Videos: 1, Shorts: 3, Posts: 0 },
    { day: "Fri", Videos: 2, Shorts: 2, Posts: 2 },
    { day: "Sat", Videos: 1, Shorts: 1, Posts: 0 },
    { day: "Sun", Videos: 0, Shorts: 1, Posts: 1 },
  ],
};

const generateOverviewData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const keys = new Set();
  Object.values(chartDataByPlatform).forEach((platformData) => {
    platformData.forEach((d) => {
      Object.keys(d).forEach((k) => {
        if (k !== "day") keys.add(k);
      });
    });
  });

  return days.map((day) => {
    const result = { day };
    keys.forEach((key) => {
      result[key] = 0;
    });

    Object.values(chartDataByPlatform).forEach((platformData) => {
      const daily = platformData.find((d) => d.day === day);
      if (daily) {
        keys.forEach((key) => {
          result[key] += daily[key] || 0;
        });
      }
    });
    return result;
  });
};

const recentPosts = [
  {
    platform: "Instagram",
    caption: "Just posted our latest reel 📸",
    media: "https://via.placeholder.com/300x180?text=Instagram+Post",
    date: "Today at 2:00PM",
    likes: 120,
    comments: 34,
  },
  {
    platform: "Facebook",
    caption: "Join us for a live Q&A session",
    media: "",
    date: "Yesterday at 5:30PM",
    likes: 65,
    comments: 12,
  },
  {
    platform: "YouTube",
    caption: "New short just dropped 🔥",
    media: "https://via.placeholder.com/300x180?text=YouTube+Short",
    date: "Today at 10:00AM",
    likes: 240,
    comments: 58,
  },
  {
    platform: "X",
    caption: "Did you catch our latest tweet?",
    media: "",
    date: "Sunday at 9:00AM",
    likes: 44,
    comments: 8,
  },
  {
    platform: "TikTok",
    caption: "Fun behind-the-scenes video 🎬",
    media: "https://via.placeholder.com/300x180?text=TikTok+Clip",
    date: "Saturday at 3:30PM",
    likes: 130,
    comments: 22,
  },
];

function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("Overview");
  const [chartType, setChartType] = useState("Bar");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const chartData =
    selectedPlatform === "Overview"
      ? generateOverviewData()
      : chartDataByPlatform[selectedPlatform] || [];

  const allKeys = Object.keys(chartData[0] || {}).filter((k) => k !== "day");

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = recentPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (direction) => {
    if (direction === "next" && indexOfLastPost < recentPosts.length) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderChart = () => {
    if (chartType === "Bar") {
      return (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          {allKeys.map((key, i) => (
            <Bar key={key} dataKey={key} stackId="a" fill={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5]} />
          ))}
        </BarChart>
      );
    }

    if (chartType === "Line") {
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          {allKeys.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} strokeWidth={2} stroke={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5]} />
          ))}
        </LineChart>
      );
    }

    if (chartType === "Area") {
      return (
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          {allKeys.map((key, i) => (
            <Area key={key} type="monotone" dataKey={key} stroke={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5]} fillOpacity={0.3} fill={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5]} />
          ))}
        </AreaChart>
      );
    }

    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.map((card, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow ${card.bg} text-gray-900 dark:text-white`}
            title={card.tooltip}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md">{card.icon}</div>
              <div>
                <p className="text-sm font-medium">{card.title}</p>
                <h3 className="text-xl font-bold">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

{/* Insights Section */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Performing Platform</p>
    <h3 className="text-lg font-semibold flex items-center gap-2">
      <FaInstagram className="text-pink-500" /> Instagram
    </h3>
    <p className="text-xs text-gray-400 mt-1">Most engagement this week</p>
  </div>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Best Time to Post</p>
    <h3 className="text-lg font-semibold">2:00 PM</h3>
    <p className="text-xs text-gray-400 mt-1">Based on highest interaction rates</p>
  </div>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Most Engaging Content Type</p>
    <h3 className="text-lg font-semibold">Reels</h3>
    <p className="text-xs text-gray-400 mt-1">Higher reach than images or carousels</p>
  </div>

  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weekly Engagement Growth</p>
    <h3 className="text-lg font-semibold text-green-500">+12%</h3>
    <p className="text-xs text-gray-400 mt-1">Compared to previous 7 days</p>
  </div>
</div>
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mt-10 mb-4 gap-4">
        <div className="space-x-2">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${
                selectedPlatform === platform
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {platformIcons[platform]} {platform}
            </button>
          ))}
        </div>
        <div className="space-x-2">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 text-sm rounded-full ${
                chartType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-10">
        <ResponsiveContainer width="100%" height={300}>{renderChart()}</ResponsiveContainer>
      </div>

      {/* Posts */}
   <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
{recentPosts.filter((post) => post.media).length === 0 ? (
  <p className="text-gray-500 dark:text-gray-400 italic">
    No recent posts with media available.
  </p>
) : (
  <div className="overflow-x-auto">
    <div className="flex gap-6 w-max pb-4">
      {recentPosts
        .filter((post) => post.media)
        .map((post, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md w-80 flex-shrink-0"
          >
            <img
              src={post.media}
              alt="Post"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-2">
              {platformIcons[post.platform]} {post.platform}
            </p>
            <p className="font-semibold mb-2">{post.caption}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {post.date}
            </p>
            <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <FaThumbsUp className="text-blue-500" /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <FaCommentDots className="text-green-500" /> {post.comments}
              </span>
            </div>
          </div>
        ))}
    </div>
  </div>
)}
    </div>
  );
}

export default Dashboard;

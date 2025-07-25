// src/features/analytics/Analytics.jsx
import React, { useState, useRef } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// ---------------------- Icons & Constants -----------------------
const platformIcons = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  x: <FaXTwitter />,
  linkedin: <FaLinkedin />,
};

const platforms = {
  overview: "",
  facebook: platformIcons.facebook,
  instagram: platformIcons.instagram,
  tiktok: platformIcons.tiktok,
  youtube: platformIcons.youtube,
  x: platformIcons.x,
  linkedin: platformIcons.linkedin,
};

const timeRanges = ["Today", "Last 7 Days", "Last 30 Days", "Custom Range"];

// ---------------------- Dummy Data -----------------------------
const dummyData = {
  instagram: {
    "Last 7 Days": {
      labels: ["Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14"],
      views: [300, 400, 500, 350, 300, 450, 480],
      reach: [250, 270, 290, 240, 230, 260, 275],
      interactions: [40, 50, 55, 48, 45, 60, 58],
      clicks: [10, 12, 11, 9, 10, 13, 14],
      followers: 1240,
      followerGrowth: [1000, 1020, 1050, 1080, 1100, 1150, 1240],
      age: [400, 500, 340],
      gender: [60, 40],
      countries: [550, 350, 150],
      posts: [
        { id: 1, title: "Insta Growth Tips", platform: "instagram", image: "https://via.placeholder.com/100", impressions: 480 },
      ],
    },
  },
  facebook: {
    "Last 7 Days": {
      labels: ["Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14"],
      views: [500, 800, 600, 700, 650, 900, 880],
      reach: [450, 500, 480, 470, 400, 530, 550],
      interactions: [60, 75, 70, 80, 65, 85, 90],
      clicks: [15, 20, 18, 12, 14, 22, 25],
      followers: 1550,
      followerGrowth: [1400, 1430, 1450, 1475, 1500, 1530, 1550],
      age: [300, 450, 400],
      gender: [55, 45],
      countries: [400, 320, 280],
      posts: [
        { id: 2, title: "Product Launch", platform: "facebook", image: "https://via.placeholder.com/100", impressions: 880 },
      ],
    },
  },
};

// ---------------------- Utility Functions ----------------------
const getOverviewTotals = (range) => {
  const metrics = ["views", "reach", "interactions", "clicks"];
  const instagram = dummyData.instagram?.[range];
  const facebook = dummyData.facebook?.[range];

  if (!instagram || !facebook) return { labels: [], ...Object.fromEntries(metrics.map(m => [m, []])), followers: 0 };

  return {
    labels: instagram.labels,
    views: instagram.views.map((val, i) => val + (facebook.views[i] || 0)),
    reach: instagram.reach.map((val, i) => val + (facebook.reach[i] || 0)),
    interactions: instagram.interactions.map((val, i) => val + (facebook.interactions[i] || 0)),
    clicks: instagram.clicks.map((val, i) => val + (facebook.clicks[i] || 0)),
    followers: instagram.followers + facebook.followers,
    followerGrowth: instagram.followerGrowth.map((val, i) => val + facebook.followerGrowth[i]),
    age: instagram.age.map((v, i) => v + facebook.age[i]),
    gender: instagram.gender.map((v, i) => v + facebook.gender[i]),
    countries: instagram.countries.map((v, i) => v + facebook.countries[i]),
    posts: [...instagram.posts, ...facebook.posts],
  };
};

const getChartData = (label, data, labels) => ({
  labels,
  datasets: [
    {
      label,
      data,
      borderColor: "rgba(59,130,246,1)",
      backgroundColor: "rgba(59,130,246,0.1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
    },
  ],
});

// ---------------------- Component ------------------------------
const Analytics = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const exportRef = useRef(null);

  const current =
    selectedPlatform === "overview"
      ? getOverviewTotals(selectedTimeRange)
      : dummyData[selectedPlatform]?.[selectedTimeRange] || getOverviewTotals("Last 7 Days");

  const exportPDF = async () => {
    const canvas = await html2canvas(exportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.text(`Analytics Report - ${selectedPlatform} | ${selectedTimeRange}`, 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, pdfWidth - 20, pdfHeight);
    pdf.save("analytics_report.pdf");
  };

  return (
    <div className="p-6 space-y-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen" ref={exportRef}>
      {/* Header & Export */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
          <FiDownload /> Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(platforms).map(([key, icon]) => (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key)}
              className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-medium border ${
                selectedPlatform === key ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {icon}
              {key === "overview" && "Overview"}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 rounded border text-sm dark:bg-gray-800 dark:text-white"
          >
            {timeRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          {selectedTimeRange === "Custom Range" && (
            <>
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="px-2 py-1 border rounded" />
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="px-2 py-1 border rounded" />
            </>
          )}
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {["views", "reach", "interactions", "clicks"].map((metric) => (
          <div key={metric} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="font-semibold capitalize mb-1">{metric}</div>
            <div className="text-xl font-bold text-blue-600 mb-2">
              {current[metric]?.reduce((a, b) => a + b, 0)}
            </div>
            <div className="h-24">
              <Line
                data={getChartData(metric, current[metric], current.labels)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: { mode: "index", intersect: false },
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Follower Growth KPI */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h4 className="text-lg font-semibold mb-4">Follower Growth</h4>
        <div className="h-72">
          <Line
            data={getChartData("Followers", current.followerGrowth, current.labels)}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: { mode: "index", intersect: false },
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Age Groups</h4>
          <Bar data={{ labels: ["18-24", "25-34", "35-44"], datasets: [{ data: current.age, backgroundColor: "rgba(59,130,246,0.6)" }] }} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Gender</h4>
          <Doughnut data={{ labels: ["Male", "Female"], datasets: [{ data: current.gender, backgroundColor: ["#60a5fa", "#f472b6"] }] }} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Top Countries</h4>
          <Bar data={{ labels: ["Tanzania", "Kenya", "Nigeria"], datasets: [{ data: current.countries, backgroundColor: "rgba(34,197,94,0.6)" }] }} />
        </div>
      </div>

      {/* Top Posts */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(current.posts || []).map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex items-center gap-4">
              <img src={post.image} alt={post.title} className="w-16 h-16 rounded object-cover" />
              <div>
                <div className="text-sm font-bold">{post.title}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  {platformIcons[post.platform]} {post.platform}
                </div>
                <div className="text-sm text-blue-500">Impressions: {post.impressions}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

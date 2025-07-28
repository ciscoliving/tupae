// src/routes/Router.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CreatePost from "../features/content/CreatePost";
import PublishedPosts from "../features/content/PublishedPosts";
import ScheduledPosts from "../features/content/ScheduledPosts";
import Drafts from "../features/content/Drafts";
import Engagement from "../features/engagement/Engagement";
import Analytics from "../features/analytics/Analytics"
import Settings from "../features/settings/Settings";
import UserProfile from "../pages/UserProfile"; // import UserProfile page
import Signup from "../pages/Signup"; // import Signup page
import LoginModalPage from "../pages/LoginModalPage";
// import other pages here...

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/published" element={<PublishedPosts />} />
      <Route path="/scheduled-posts" element={<ScheduledPosts />} />
      <Route path="/drafts" element={<Drafts />} />
      <Route path="/engagement" element={<Engagement />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<UserProfile />} /> {/* Add UserProfile route */}
      <Route path="/signup" element={<Signup />} /> {/* Add Signup route */}
      <Route path="/login" element={<LoginModalPage />} /> {/* Add LoginModalPage route */}
      {/* Add other routes here */}
    </Routes>
  );
}

export default AppRoutes;

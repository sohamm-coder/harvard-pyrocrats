import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommunityForumPage from "./pages/CommunityForumPage";
import CrowdfundingPage from "./pages/CrowdfundingPage";
import SeizureControlPage from "./pages/SeizureControlPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import MultilingualHub from "./pages/MultilingualHub";
import SleepTrackerPage from "./pages/SleepTrackerPage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ExpertConnect from "./pages/ExpertConnect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <Router>
      {/* ✅ Show Navbar only if the user is authenticated */}
      <Navbar />

      {/* 🏠 Define Routes */}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default page */}
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* 🌟 Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<CommunityForumPage />} />
        <Route path="/crowdfunding" element={<CrowdfundingPage />} />
        <Route path="/sleep-tracker" element={<SleepTrackerPage />} />
        <Route path="/seizure-control" element={<SeizureControlPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/multilingual-hub" element={<MultilingualHub />} />
        <Route path="/experts" element={<ExpertConnect />} />
      </Routes>
    </Router>
  );
};

export default App;

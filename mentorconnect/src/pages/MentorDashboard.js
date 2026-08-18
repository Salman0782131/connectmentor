import React from "react";
import MentorNavbar from "../components/MentorNavbar";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarCheck, FaBookOpen, FaClipboardCheck, FaChartLine, FaVideo } from "react-icons/fa";

function MentorDashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl">
        Please login first
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
      <MentorNavbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          Mentor Dashboard
        </h1>

        {/* ✅ ONLY CARDS (NO BOOKINGS SECTION) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <Link to="/manage-mentees" className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition text-center">
            <FaUsers className="text-6xl text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Manage Mentees</h2>
          </Link>

          <Link to="/schedule-meetings" className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition text-center">
            <FaCalendarCheck className="text-6xl text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Schedule Meetings</h2>
          </Link>

          <Link to="/resources-materials" className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition text-center">
            <FaBookOpen className="text-6xl text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Resources</h2>
          </Link>

          <Link to="/review-requests" className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition text-center">
            <FaClipboardCheck className="text-6xl text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Review Requests</h2>
          </Link>

          <Link to="/performance-dashboard" className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition text-center">
            <FaChartLine className="text-6xl text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Performance</h2>
          </Link>

          <Link to="/video-call" className="bg-white p-8 rounded-xl shadow hover:shadow-2xl transition text-center">
            <FaVideo className="text-6xl text-pink-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Video Call</h2>
          </Link> 

        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;
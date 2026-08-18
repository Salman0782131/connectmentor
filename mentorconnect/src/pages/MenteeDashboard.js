import React, { useEffect, useState } from "react";
import MenteeNavbar from "../components/MenteeNavbar";
import { Link } from "react-router-dom";
import { FaClipboardList, FaBook, FaCode } from "react-icons/fa";
import { supabase } from "../supabase";

function MenteeDashboard() {
  const [data, setData] = useState(null);
  const [attendance, setAttendance] = useState(0); // 🔥 NEW

  useEffect(() => {
    fetchStats();
    fetchAttendance(); // 🔥 NEW
  }, []);

  const fetchStats = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      console.log("User not found");
      return;
    }

    const { data, error } = await supabase
      .from("coding_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log("FETCH:", data, error);

    if (data) {
      setData(data);
    }
  };

  // 🔥 NEW FUNCTION
  const fetchAttendance = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.email) return;

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*");

    const userBookings = (bookings || []).filter(
      (b) =>
        b.mentee_email &&
        b.mentee_email.toLowerCase() === user.email.toLowerCase()
    );

    const total = userBookings.length;
    const attended = userBookings.filter((b) => b.attended === true).length;

    const percent = total > 0 ? (attended / total) * 100 : 0;

    setAttendance(percent);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MenteeNavbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Mentee Dashboard
        </h1>

        {/* 🔥 ATTENDANCE REMINDER */}
        <div className="max-w-xl mx-auto mb-6">
          <div
            className={`p-4 rounded-lg text-center font-semibold 
            ${
              attendance < 50
                ? "bg-red-100 text-red-700"
                : attendance < 75
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            Attendance: {attendance.toFixed(1)}%
            <br />

            {attendance < 50 &&
              "⚠️ Very low attendance. Attend sessions regularly."}
            {attendance >= 50 &&
              attendance < 75 &&
              "⚠️ Below 75%. Improve consistency."}
            {attendance >= 75 && "✅ Good attendance. Keep it up!"}
          </div>
        </div>

        {/* 🔹 DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link to="/explore-mentors" className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center">
            <i className="fas fa-user-tie text-blue-500 text-5xl"></i>
            <h2 className="text-xl font-semibold mt-4">Explore Mentors</h2>
          </Link>

          <Link to="/ai-chatbot" className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center">
            <i className="fas fa-robot text-green-500 text-5xl"></i>
            <h2 className="text-xl font-semibold mt-4">AI Chatbot</h2>
          </Link>

          <Link to="/flexible-scheduling" className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center">
            <i className="fas fa-calendar-alt text-purple-500 text-5xl"></i>
            <h2 className="text-xl font-semibold mt-4">Scheduling</h2>
          </Link>

          <Link to="/resources">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center">
              <FaBook className="text-purple-500 text-5xl mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Resources & Materials</h2>
            </div>
          </Link>

          <Link to="/video-call" className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center">
            <i className="fas fa-video text-red-500 text-5xl"></i>
            <h2 className="text-xl font-semibold mt-4">Video Call</h2>
          </Link>

          <Link to="/my-bookings">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center">
              <FaClipboardList className="text-blue-500 text-5xl mx-auto mb-3" />
              <h2 className="text-xl font-semibold">My Bookings</h2>
            </div>
          </Link>

          <Link to="/coding-tracker">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transform hover:scale-105 transition text-center border-t-4 border-green-500">
              <FaCode className="text-green-500 text-5xl mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Coding Tracker</h2>
            </div>
          </Link>

        </div>

        {/* 🔥 CODING STATS DISPLAY */}
        {data && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">

            <h2 className="text-xl font-bold mb-4 text-green-600">
              📊 Coding Progress
            </h2>

            <p>Attempted: {data.total_attempted}</p>
            <p>Solved: {data.total_solved}</p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-green-100 p-2 rounded text-center">
                Easy: {data.easy}
              </div>
              <div className="bg-yellow-100 p-2 rounded text-center">
                Medium: {data.medium}
              </div>
              <div className="bg-red-100 p-2 rounded text-center">
                Hard: {data.hard}
              </div>
            </div>

            <div className="mt-4">
              <div className="bg-gray-200 h-3 rounded">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{
                    width: `${
                      data.total_attempted > 0
                        ? (data.total_solved / data.total_attempted) * 100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>

            <p className="mt-3 font-semibold">
              {data.total_solved > 150
                ? "🔥 Excellent progress!"
                : data.total_solved > 50
                ? "👍 Good consistency!"
                : "🚀 Keep practicing!"}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default MenteeDashboard;
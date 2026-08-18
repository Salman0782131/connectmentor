import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function ManageMentees() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        if (!user || !user.email) {
          setLoading(false);
          return;
        }

        const mentorEmail = user.email.trim().toLowerCase();

        // 🔹 BOOKINGS
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*");

        const mentorBookings = (bookings || []).filter(
          (b) =>
            b.mentor_email &&
            b.mentor_email.trim().toLowerCase() === mentorEmail
        );

        if (mentorBookings.length === 0) {
          setMentees([]);
          setLoading(false);
          return;
        }

        // 🔹 UNIQUE EMAILS
        const uniqueEmails = [
          ...new Set(
            mentorBookings
              .map((b) => b.mentee_email?.trim().toLowerCase())
              .filter(Boolean)
          ),
        ];

        // 🔹 USERS
        const { data: usersData } = await supabase
          .from("users")
          .select("*");

        const menteesOnly = (usersData || []).filter(
          (u) =>
            u.email &&
            uniqueEmails.includes(u.email.trim().toLowerCase()) &&
            u.role === "mentee"
        );

        // 🔹 CODING STATS
        const { data: stats } = await supabase
          .from("coding_stats")
          .select("*");

        // 🔥 ATTENDANCE MAP
        const attendanceMap = {};

        (mentorBookings || []).forEach((b) => {
          const email = b.mentee_email?.toLowerCase().trim();

          if (!attendanceMap[email]) {
            attendanceMap[email] = { total: 0, attended: 0 };
          }

          attendanceMap[email].total += 1;

          if (b.attended === true) {
            attendanceMap[email].attended += 1;
          }
        });

        // 🔥 MERGE EVERYTHING
        const finalMentees = menteesOnly.map((m) => {
          const stat = stats?.find(
            (s) => String(s.user_id) === String(m.id)
          );

          const solved = stat?.total_solved || 0;
          const attempted = stat?.total_attempted || 0;

          const accuracy =
            attempted > 0 ? (solved / attempted) * 100 : 0;

          const att = attendanceMap[m.email?.toLowerCase().trim()] || {
            total: 0,
            attended: 0,
          };

          const attendance =
            att.total > 0 ? (att.attended / att.total) * 100 : 0;

          // 🔥 FINAL PROGRESS (WEIGHTED)
          const progress = 0.7 * accuracy + 0.3 * attendance;

          return {
            ...m,
            progress,
            attendance,
          };
        });

        setMentees(finalMentees);
        setLoading(false);

      } catch (err) {
        console.log("Error:", err);
        setLoading(false);
      }
    };

    fetchMentees();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 p-6">

      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Manage Mentees
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : mentees.length === 0 ? (
        <p className="text-center text-gray-600">No mentees found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {mentees.map((m) => {

            let statusText = "";
            let statusColor = "";

            if (m.progress < 50) {
              statusText = "⚠️ Needs serious improvement";
              statusColor = "bg-red-100 text-red-700";
            } else if (m.progress < 75) {
              statusText = "👍 Moderate performance";
              statusColor = "bg-yellow-100 text-yellow-700";
            } else {
              statusText = "🔥 Excellent performance";
              statusColor = "bg-green-100 text-green-700";
            }

            return (
              <div
                key={m.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
              >

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 text-lg font-bold">
                  {m.name ? m.name.charAt(0).toUpperCase() : "?"}
                </div>

                {/* Name */}
                <h2 className="text-xl font-semibold text-gray-800">
                  {m.name || "No Name"}
                </h2>

                {/* Email */}
                <p className="text-sm text-gray-500 mb-3">
                  {m.email}
                </p>

                {/* Progress */}
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Progress: {m.progress.toFixed(1)}%
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${m.progress}%` }}
                  ></div>
                </div>

                {/* 🔥 STATUS ALERT */}
                <div className={`p-2 rounded text-sm font-semibold text-center ${statusColor}`}>
                  {statusText}
                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default ManageMentees;
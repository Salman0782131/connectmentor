import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function PerformanceDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: stats } = await supabase
      .from("coding_stats")
      .select("*");

    const { data: users } = await supabase
      .from("users")
      .select("id, name, email");

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*");

    // 🔥 Attendance Map
    const attendanceMap = {};

    (bookings || []).forEach((b) => {
      const email = String(b.mentee_email || "")
        .toLowerCase()
        .trim();

      if (!attendanceMap[email]) {
        attendanceMap[email] = {
          total: 0,
          attended: 0
        };
      }

      attendanceMap[email].total += 1;

      if (b.attended === true) {
        attendanceMap[email].attended += 1;
      }
    });

    const merged = (stats || []).map((s) => {
      const user = users?.find(
        (u) => String(u.id) === String(s.user_id)
      );

      const email = user?.email?.toLowerCase().trim();

      const att = attendanceMap[email] || {
        total: 0,
        attended: 0
      };

      return {
        ...s,
        user,
        total_sessions: att.total,
        attended_sessions: att.attended
      };
    });

    setStudents(merged);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        📊 Performance Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {students.map((student, index) => {
          const solved = student.total_solved || 0;
          const attempted = student.total_attempted || 0;

          const accuracy =
            attempted > 0 ? (solved / attempted) * 100 : 0;

          const attendance =
            student.total_sessions > 0
              ? (student.attended_sessions / student.total_sessions) * 100
              : 0;

          return (
            <div key={index} className="bg-white p-5 rounded-xl shadow">

              <h2 className="font-bold text-lg">
                {student.user?.name || "Unknown"}
              </h2>

              <p className="text-sm text-gray-500">
                {student.user?.email}
              </p>

              <p className="mt-2">Attempted: {attempted}</p>
              <p>Solved: {solved}</p>

              {/* Accuracy */}
              <div className="mt-4">
                <p className="text-sm font-semibold">
                  LeetCode: {accuracy.toFixed(1)}%
                </p>

                <div className="bg-gray-200 h-3 rounded">
                  <div
                    className="bg-purple-500 h-3 rounded"
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>

              {/* Attendance */}
              <div className="mt-4">
                <p className="text-sm">
                  Attendance: {attendance.toFixed(1)}%
                </p>

                <div className="bg-gray-200 h-3 rounded">
                  <div
                    className="bg-blue-500 h-3 rounded"
                    style={{ width: `${attendance}%` }}
                  ></div>
                </div>
              </div>

              {/* 🔥 NEW: Attendance Reminder */}
              <div
                className={`mt-3 p-2 rounded text-sm font-semibold text-center
                ${
                  attendance < 50
                    ? "bg-red-100 text-red-700"
                    : attendance < 75
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {attendance < 50 &&
                  "⚠️ Very low attendance"}
                {attendance >= 50 && attendance < 75 &&
                  "⚠️ Needs improvement (<75%)"}
                {attendance >= 75 &&
                  "✅ Good attendance"}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default PerformanceDashboard;
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("mentee_email", user.email)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setBookings(data || []);
    }
  };

  // 🔥 MARK ATTENDANCE
  const markAttendance = async (id) => {
    const { error } = await supabase
      .from("bookings")
      .update({ attended: true })
      .eq("id", id);

    if (error) {
      alert("Failed to mark attendance ❌");
    } else {
      alert("Attendance marked ✅");

      // update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, attended: true } : b
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-14 text-center">
        <h1 className="text-4xl font-bold">My Bookings</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >

                {/* MENTOR */}
                <h2 className="font-semibold mb-2">
                  {b.mentor_email}
                </h2>

                {/* DATE TIME */}
                <p>📅 {b.date || "Not set"}</p>
                <p>⏰ {b.time || "Not set"}</p>

                {/* STATUS */}
                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={
                      b.status === "accepted"
                        ? "text-green-600"
                        : b.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {b.status || "pending"}
                  </span>
                </p>

                {/* MEETING INFO */}
                {b.status === "accepted" && (
                  <div className="mt-3 p-3 bg-green-50 rounded">
                    <p className="text-green-700 font-semibold">
                      Meeting Scheduled
                    </p>
                    <p>📅 {b.date}</p>
                    <p>⏰ {b.time}</p>
                  </div>
                )}

                {/* ATTENDANCE STATUS */}
                <p className="mt-3">
                  Attendance:{" "}
                  <span
                    className={
                      b.attended
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {b.attended ? "Completed" : "Pending"}
                  </span>
                </p>

                {/* ATTEND BUTTON */}
                <button
                  onClick={() => markAttendance(b.id)}
                  disabled={
                    b.status !== "accepted" || b.attended
                  }
                  className={`mt-4 w-full py-2 rounded text-white ${
                    b.attended
                      ? "bg-green-600"
                      : b.status !== "accepted"
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {b.attended ? "Attended ✅" : "Mark as Attended"}
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;
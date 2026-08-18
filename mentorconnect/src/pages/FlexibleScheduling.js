// src/pages/FlexibleScheduling.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function FlexibleScheduling() {
  const [sessions, setSessions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 Fetch + realtime
  useEffect(() => {
    fetchSessions();

    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => fetchSessions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSessions = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("mentee_email", user.email)
      .eq("status", "accepted")
      .order("id", { ascending: false });

    setSessions(data || []);
  };

  // 🔥 Convert date+time → Date object
  const getSessionDateTime = (date, time) => {
    return new Date(`${date}T${time}`);
  };

  // 🔥 Time difference
  const getTimeLeft = (sessionTime) => {
    const diff = sessionTime - currentTime;

    if (diff <= 0) return "Live Now";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-14 text-center">
        <h1 className="text-4xl font-bold">
          Scheduled Sessions
        </h1>
        <p className="mt-2 text-lg">
          Real-time confirmed sessions
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        {sessions.length === 0 ? (
          <p className="text-center text-gray-500">
            No confirmed sessions
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {sessions.map((s) => {
              const sessionTime = getSessionDateTime(s.date, s.time);
              const isLive = currentTime >= sessionTime;
              const timeLeft = getTimeLeft(sessionTime);

              return (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
                >
                  {/* Mentor */}
                  <h2 className="text-xl font-semibold mb-2">
                    {s.mentor_email}
                  </h2>

                  {/* Date/Time */}
                  <p>📅 {s.date}</p>
                  <p>⏰ {s.time}</p>

                  {/* Countdown */}
                  <p className="mt-2 text-sm text-gray-600">
                    {isLive ? (
                      <span className="text-green-600 font-semibold">
                        🔴 Live Now
                      </span>
                    ) : (
                      <>Starts in: {timeLeft}</>
                    )}
                  </p>

                  {/* Join Button */}
                  <button
                    disabled={!isLive}
                    onClick={() => window.location.href = "/video-call"}
                    className={`mt-4 w-full py-2 rounded ${
                      isLive
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLive ? "Join Session" : "Not Started"}
                  </button>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default FlexibleScheduling;
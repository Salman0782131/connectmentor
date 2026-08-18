import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function ExploreMentors() {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "mentor");

    console.log("MENTORS:", data, error);

    if (!error) setMentors(data || []);
  };

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !selectedMentor || !date || !time) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const payload = {
      mentor_email: selectedMentor.email,
      mentee_email: user.email,
      date: date,
      time: time,

      // 🔥 REQUIRED FIELDS (FIX)
      status: "pending",
      completed: false,
      attended: false,
      meeting_link: null,
      meeting_note: null
    };

    console.log("BOOKING PAYLOAD:", payload);

    const { data, error } = await supabase
      .from("bookings")
      .insert([payload]);

    console.log("BOOKING RESPONSE:", { data, error });

    setLoading(false);

    if (error) {
      alert("Booking failed ❌");
      console.log("ERROR:", error);
    } else {
      alert("Booking successful ✅");

      setSelectedMentor(null);
      setDate("");
      setTime("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Explore Mentors
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((m) => (
          <div
            key={m.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{m.name}</h2>
            <p className="text-gray-600">{m.email}</p>

            <button
              onClick={() => setSelectedMentor(m)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Schedule
            </button>
          </div>
        ))}
      </div>

      {selectedMentor && (
        <div className="mt-10 max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-center">
            Book with {selectedMentor.name}
          </h2>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExploreMentors;
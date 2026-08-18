import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function MentorBookings() {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("mentor_email", user.email)
        .order("id", { ascending: false });

      if (error) console.log(error);
      else setBookings(data || []);
    };

    fetchBookings();
  }, [user]);

  // 🔥 DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this booking?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .eq("mentor_email", user.email); // 🔒 safety

    if (error) {
      console.log(error);
      alert("Delete failed");
    } else {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Booking Requests
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center">No bookings</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="bg-white p-4 mb-3 rounded shadow">
            <p><b>Mentee:</b> {b.mentee_email}</p>
            <p><b>Date:</b> {b.date}</p>
            <p><b>Time:</b> {b.time}</p>

            <button
              onClick={() => handleDelete(b.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MentorBookings;
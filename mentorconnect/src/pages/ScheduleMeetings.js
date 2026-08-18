import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

function ScheduleMeetings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingName, setMeetingName] = useState(''); // 🔥 NEW

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("mentor_email", user.email)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setBookings(data || []);
    }
  };

  // 🔥 UNIQUE MENTEES
  const uniqueBookings = Object.values(
    bookings.reduce((acc, b) => {
      const email = b.mentee_email?.trim().toLowerCase();
      if (!email) return acc;

      if (!acc[email]) acc[email] = b;

      return acc;
    }, {})
  );

  const scheduleMeeting = async () => {
    if (!selectedBooking) {
      alert("Please select a mentee");
      return;
    }

    if (!date || !time || !meetingName) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        date,
        time,
        meeting_name: meetingName, // 🔥 NEW
        status: "accepted"
      })
      .eq("id", selectedBooking.id)
      .eq("mentor_email", user.email);

    if (error) {
      console.log(error);
      alert("Failed to schedule meeting");
    } else {
      alert("Meeting scheduled successfully!");
      fetchBookings();
      setSelectedBooking(null);
      setDate('');
      setTime('');
      setMeetingName(''); // reset
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        Schedule Meetings
      </h1>

      <div className="max-w-2xl mx-auto">

        {/* SELECTED */}
        {selectedBooking && (
          <div className="mb-4 p-3 bg-green-100 rounded text-center">
            Selected: <b>{selectedBooking.mentee_email}</b>
          </div>
        )}

        {/* BOOKINGS */}
        <div className="space-y-3 mb-6">
          {uniqueBookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings</p>
          ) : (
            uniqueBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className={`p-4 rounded-lg cursor-pointer border transition ${
                  selectedBooking?.id === b.id
                    ? "bg-blue-200 border-blue-600"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <p className="font-medium text-gray-800">
                  {b.mentee_email}
                </p>

                {/* 🔥 show meeting name if exists */}
                {b.meeting_name && (
                  <p className="text-sm text-gray-500">
                    {b.meeting_name}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* 🔥 MEETING NAME */}
        <input
          type="text"
          placeholder="Meeting Title (e.g. DSA Session)"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        {/* TIME */}
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        {/* BUTTON */}
        <button
          onClick={scheduleMeeting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Schedule Meeting
        </button>

      </div>
    </div>
  );
}

export default ScheduleMeetings;
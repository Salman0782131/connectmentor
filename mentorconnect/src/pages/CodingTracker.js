import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

function CodingTracker() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 First-time input
  const [initialStats, setInitialStats] = useState({
    attempted: "",
    easy: "",
    medium: "",
    hard: ""
  });

  // 🔹 Update mode
  const [update, setUpdate] = useState({
    easy: "",
    medium: "",
    hard: "",
    attempted: ""
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await supabase
      .from("coding_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setData(data);
    setLoading(false);
  };

  // ✅ FIRST TIME SAVE
  const saveInitial = async () => {
    const totalSolved =
      Number(initialStats.easy || 0) +
      Number(initialStats.medium || 0) +
      Number(initialStats.hard || 0);

    const payload = {
      user_id: user.id,
      platform: "leetcode",
      total_attempted: Number(initialStats.attempted || 0),
      total_solved: totalSolved,
      easy: Number(initialStats.easy || 0),
      medium: Number(initialStats.medium || 0),
      hard: Number(initialStats.hard || 0)
    };

    const { error } = await supabase
      .from("coding_stats")
      .insert(payload);

    if (!error) {
      alert("Saved ✅");
      fetchStats();
    } else {
      alert("Error ❌");
      console.log(error);
    }
  };

  // ✅ UPDATE (correct logic)
  const updateStats = async () => {
    if (!data) return;

    const addEasy = Number(update.easy || 0);
    const addMedium = Number(update.medium || 0);
    const addHard = Number(update.hard || 0);

    const newEasy = data.easy + addEasy;
    const newMedium = data.medium + addMedium;
    const newHard = data.hard + addHard;

    const newSolved = newEasy + newMedium + newHard;

    // 🔥 Attempted ONLY changes if user enters it
    const newAttempted =
      update.attempted !== ""
        ? Number(update.attempted)
        : data.total_attempted;

    // 🚨 validation
    if (newAttempted < newSolved) {
      alert("Attempted cannot be less than solved ❌");
      return;
    }

    const { error } = await supabase
      .from("coding_stats")
      .update({
        easy: newEasy,
        medium: newMedium,
        hard: newHard,
        total_solved: newSolved,
        total_attempted: newAttempted
      })
      .eq("user_id", user.id);

    if (!error) {
      alert("Updated ✅");
      fetchStats();
      setUpdate({ easy: "", medium: "", hard: "", attempted: "" });
    } else {
      alert("Update failed ❌");
      console.log(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

        {/* 🔹 FIRST TIME UI */}
        {!data && (
          <>
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
              Enter Your Coding Stats
            </h2>

            <input
              placeholder="Total Attempted"
              className="w-full p-2 border mb-2"
              onChange={(e) =>
                setInitialStats({ ...initialStats, attempted: e.target.value })
              }
            />

            <div className="grid grid-cols-3 gap-2 mb-3">
              <input
                placeholder="Easy"
                className="p-2 border"
                onChange={(e) =>
                  setInitialStats({ ...initialStats, easy: e.target.value })
                }
              />
              <input
                placeholder="Medium"
                className="p-2 border"
                onChange={(e) =>
                  setInitialStats({ ...initialStats, medium: e.target.value })
                }
              />
              <input
                placeholder="Hard"
                className="p-2 border"
                onChange={(e) =>
                  setInitialStats({ ...initialStats, hard: e.target.value })
                }
              />
            </div>

            <button
              onClick={saveInitial}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Save Stats
            </button>
          </>
        )}

        {/* 🔹 UPDATE UI */}
        {data && (
          <>
            <h2 className="text-xl font-bold mb-4 text-green-600 text-center">
              Update Progress
            </h2>

            <div className="text-center mb-4">
              <p>Attempted: {data.total_attempted}</p>
              <p>Solved: {data.total_solved}</p>
            </div>

            {/* Increment solved */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <input
                placeholder="+ Easy"
                value={update.easy}
                onChange={(e) =>
                  setUpdate({ ...update, easy: e.target.value })
                }
                className="p-2 border"
              />
              <input
                placeholder="+ Medium"
                value={update.medium}
                onChange={(e) =>
                  setUpdate({ ...update, medium: e.target.value })
                }
                className="p-2 border"
              />
              <input
                placeholder="+ Hard"
                value={update.hard}
                onChange={(e) =>
                  setUpdate({ ...update, hard: e.target.value })
                }
                className="p-2 border"
              />
            </div>

            {/* Manual attempted update */}
            <input
              placeholder="Update Attempted (optional)"
              value={update.attempted}
              onChange={(e) =>
                setUpdate({ ...update, attempted: e.target.value })
              }
              className="w-full p-2 border mb-3"
            />

            <button
              onClick={updateStats}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Update Stats
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CodingTracker;
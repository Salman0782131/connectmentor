import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      if (!storedUser) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", storedUser.email)
        .single();

      if (data) {
        setUserData(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setSkills(data.skills || "");
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        name,
        bio,
        skills,
      })
      .eq("email", storedUser.email);

    if (error) {
      alert("Update failed");
      return;
    }

    // update local state + storage
    const updated = { ...userData, name, bio, skills };
    setUserData(updated);
    localStorage.setItem("user", JSON.stringify(updated));

    alert("Profile updated");
  };

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          Profile
        </h2>

        {/* Email */}
        <label className="text-sm text-gray-600">Email</label>
        <input
          value={userData.email}
          disabled
          className="w-full p-2 border mb-3 bg-gray-100"
        />

        {/* Role */}
        <label className="text-sm text-gray-600">Role</label>
        <input
          value={userData.role}
          disabled
          className="w-full p-2 border mb-3 bg-gray-100"
        />

        {/* Name */}
        <label className="text-sm text-gray-600">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border mb-3"
        />

        {/* Bio */}
        <label className="text-sm text-gray-600">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border mb-3"
          placeholder="Tell something about yourself..."
        />

        {/* Skills */}
        <label className="text-sm text-gray-600">Skills / Interests</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 border mb-4"
          placeholder="e.g. React, Python"
        />

        <button
          onClick={updateProfile}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default Profile;
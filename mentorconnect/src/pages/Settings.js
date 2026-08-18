import React, { useState } from "react";
import { supabase } from "../supabase";

function Settings() {
  const [password, setPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const updatePassword = async () => {
    const { error } = await supabase
      .from("users")
      .update({ password })
      .eq("email", user.email);

    if (error) alert("Failed");
    else alert("Password updated");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={updatePassword}
        className="bg-blue-600 text-white w-full py-2 mb-3"
      >
        Update Password
      </button>

      <button
        onClick={logout}
        className="bg-red-500 text-white w-full py-2"
      >
        Logout
      </button>

    </div>
  );
}

export default Settings;
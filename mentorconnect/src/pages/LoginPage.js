import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";

function LoginPage({ defaultRole }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: defaultRole || "mentee"
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultRole) {
      setFormData((prev) => ({ ...prev, role: defaultRole }));
    }
  }, [defaultRole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPassword = formData.password.trim();

      const { data: existingUsers } = await supabase
        .from("users")
        .select("email, role")
        .eq("email", cleanEmail)
        .eq("role", formData.role);

      if (!existingUsers || existingUsers.length === 0) {
        alert(`No ${formData.role} found with this email`);
        return;
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", cleanEmail)
        .eq("password", cleanPassword)
        .eq("role", formData.role)
        .single();

      if (error || !user) {
        alert("Invalid password");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      navigate(user.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard");

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          MentorConnect
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to continue
        </p>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("mentee")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              formData.role === "mentee"
                ? "bg-indigo-600 text-white"
                : "text-gray-600"
            }`}
          >
            Mentee
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("mentor")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              formData.role === "mentor"
                ? "bg-indigo-600 text-white"
                : "text-gray-600"
            }`}
          >
            Mentor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : `Login as ${formData.role}`}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?
        </p>

        <div className="flex justify-center gap-4 mt-2 text-sm">
          <Link to="/mentee-signup" className="text-indigo-600 hover:underline">
            Mentee Signup
          </Link>
          <Link to="/mentor-signup" className="text-indigo-600 hover:underline">
            Mentor Signup
          </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
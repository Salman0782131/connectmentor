import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

function MenteeSignup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role: "mentee"
          }
        ]);

      console.log("SIGNUP:", data, error);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Signup successful!");
      navigate("/");

    } catch (err) {
      console.log("CRASH:", err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Mentee Signup
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 underline">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default MenteeSignup;
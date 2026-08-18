import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function MentorSignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [skills, setSkills] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name.trim(),
          email: cleanEmail,
          password: cleanPassword,
          role: "mentor",
          experience: Number(experience),
          qualification: qualification.trim(),
          skills: skills.trim()
        }
      ]);

    console.log("SIGNUP:", data, error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-4">Mentor Signup</h2>

        <form className="space-y-4" onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="number"
            placeholder="Experience (years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <textarea
            placeholder="Qualifications"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded-md">
            Sign Up as Mentor
          </button>

          <div className="text-center">
            <Link to="/login" className="text-blue-600 underline">
              Already have an account? Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default MentorSignupPage;
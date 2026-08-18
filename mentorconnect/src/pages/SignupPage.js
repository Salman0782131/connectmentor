import React, { useState } from "react";
import { supabase } from "../supabase";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentee"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.email || !form.password) {
      alert("Enter all fields");
      return;
    }

    // 🔥 insert user into DB
    const { error } = await supabase.from("users").insert([form]);

    if (error) {
      console.log(error);
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful!");
    }
  };

  return (
    <div className="p-6">
      <h2>Signup</h2>

      <input name="name" placeholder="Name" onChange={handleChange} /><br/>
      <input name="email" placeholder="Email" onChange={handleChange} /><br/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br/>

      <select name="role" onChange={handleChange}>
        <option value="mentee">Mentee</option>
        <option value="mentor">Mentor</option>
      </select><br/>

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;
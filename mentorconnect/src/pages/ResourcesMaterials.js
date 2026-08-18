// src/pages/ResourcesMaterials.js
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

function ResourcesMaterials() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("mentor_email", user.email);

    if (!error) {
      setResources(data || []);
    }
  };

  const handleAdd = async () => {
    if (!user || !user.email) {
      alert("User not logged in");
      return;
    }

    if (!title || !link) {
      alert("Title and Link required");
      return;
    }

    const { error } = await supabase
      .from("resources")
      .insert([
        {
          mentor_email: user.email,
          title: title,
          description: description,
          link: link
        }
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Resource added!");
      setTitle("");
      setLink("");
      setDescription("");
      fetchResources();
    }
  };

  // 🚨 block mentee from editing page
  if (!user || user.role !== "mentor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-red-600 text-2xl">
          Access Denied
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-3xl font-bold">
          Manage Resources
        </h1>
      </div>

      {/* FORM */}
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add Resource
        </button>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto mt-6">
        {resources.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded shadow mb-3">
            <h3 className="font-semibold">{r.title}</h3>
            <p>{r.description}</p>
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Open Resource
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ResourcesMaterials;
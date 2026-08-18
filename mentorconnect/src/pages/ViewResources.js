// src/pages/ViewResources.js
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function ViewResources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*");

    if (!error) {
      setResources(data || []);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-14 text-center">
        <h1 className="text-4xl font-bold">
          Resources & Materials
        </h1>
        <p className="mt-2 text-lg">
          Learn from your mentors
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {resources.length === 0 ? (
          <p className="text-center text-gray-500">
            No resources available
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resources.map((r) => (
              <div
                key={r.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {r.title}
                </h2>

                <p className="text-gray-600 mb-3">
                  {r.description}
                </p>

                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Open Resource
                </a>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default ViewResources;
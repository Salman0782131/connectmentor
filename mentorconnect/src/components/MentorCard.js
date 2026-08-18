// src/components/MentorCard.js
import React from 'react';

function MentorCard({ mentor }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">{mentor.name}</h2>
      <p className="text-gray-700 mb-2">{mentor.expertise}</p>
      <p className="text-gray-500 mb-4">{mentor.availability}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Connect</button>
    </div>
  );
}

export default MentorCard;

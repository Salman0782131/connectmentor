// src/pages/Roadmap.js
import React, { useState } from 'react';
import axios from 'axios'; // For API requests
import { FiSend, FiRefreshCw } from 'react-icons/fi'; // Updated icon import
import { FaMapSigns } from 'react-icons/fa';

function Roadmap() {
  const [formData, setFormData] = useState({
    interests: '',
    qualifications: '',
    careerGoals: '',
  });
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-roadmap', formData);
      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError('An error occurred while generating the roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">Career Roadmap</h1>
        <p className="text-lg text-gray-600 text-center mb-6">
          Provide your details below to receive a personalized career roadmap.
        </p>
        
        {/* Input Form */}
        <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Enter Your Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="interests">
                Interests
              </label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Describe your interests..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="qualifications">
                Qualifications
              </label>
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="List your qualifications..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="careerGoals">
                Career Goals
              </label>
              <textarea
                id="careerGoals"
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Describe your career goals..."
              />
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-3 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300 ${loading ? 'bg-blue-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={loading}
            >
              {loading ? <FiRefreshCw className="animate-spin mr-2" /> : <FiSend className="mr-2" />} 
              {loading ? 'Generating...' : 'Generate Roadmap'}
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </form>
        </div>

        {/* Display Roadmap */}
        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            <FaMapSigns className="inline mr-2 text-blue-500" />
            Your Roadmap
          </h2>
          {roadmap ? (
            <div className="text-gray-800">{roadmap}</div>
          ) : (
            <p className="text-center text-gray-500">Your generated roadmap will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Roadmap;

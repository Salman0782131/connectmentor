import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-screen" style={{ backgroundImage: 'url(https://unsplash.com/photos/FHnnjk1Yj7Y/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM5NzUwODU1&force=true&w=1920)' }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-100">
          Empower Your Career with <span className="text-teal-300">Expert Mentorship</span>
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-300">Connect with industry leaders and achieve your career goals with personalized guidance.</p>
        <Link to="/login">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
            Explore Mentors and Mentees
          </button>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;

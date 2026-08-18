import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Header />
      <HeroSection />
      <Features />
      <Footer />
    </div>
  );
}

export default HomePage;

import React from 'react';

function Features() {
  return (
    <section className="py-16 px-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Automated Scheduling</h3>
            <p>
              Easily book and manage meetings with your mentors through our automated scheduling system.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Video Call Integration</h3>
            <p>
              Enjoy seamless video calls with mentors right on the platform, complete with chat functionality.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Expert Mentorship</h3>
            <p>
              Connect with seasoned professionals and industry leaders for valuable career guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;

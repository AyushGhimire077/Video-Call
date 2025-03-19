// Sidebar.jsx
import React from 'react';
import FetchUser from './FetchUser';

const Sidebar = () => {
  return (
    <div className="abosolute top-0 left-0 h-[100vh] overflow-y-hidden w-full md:w-80 lg:w-96 bg-gray-800 flex flex-col min-h-screen border-r border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-teal-400 rounded-lg">
            <svg 
              className="w-6 h-6 text-gray-900" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-teal-400">IBER</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          User Directory
        </h2>
        <FetchUser />
      </div>
    </div>
  );
};

export default Sidebar;

import React from 'react';

const Authentication: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-12 text-center border border-gray-200/60">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h1>
        <p className="text-gray-600">Please sign in to continue.</p>
      </div>
    </div>
  );
};

export default Authentication;

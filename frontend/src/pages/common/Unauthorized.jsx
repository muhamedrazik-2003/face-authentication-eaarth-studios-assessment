import React from 'react';

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ingido-50 px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        🚫 Unauthorized
      </h1>
      <p className="text-gray-600 text-lg max-w-md">
        You do not have permission to access this page. Please contact the administrator if you believe this is an error.
      </p>
    </div>
  );
}

export default Unauthorized;

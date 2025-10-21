import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ingido-50 px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        404 – Page Not Found
      </h1>
      <p className="text-gray-600 text-lg max-w-md">
        The page you are looking for doesn’t exist or has been moved. Please check the URL or return to the homepage.
      </p>
    </div>
  );
}

export default NotFound;
import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link
          to="/admin"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition duration-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
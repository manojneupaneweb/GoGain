import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell } from 'react-icons/fa';

function PageNotFound() {
  return (
    <div className="min-h-screen w-full to-gray-800 flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center max-w-md space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center items-center text-orange-500 text-7xl">
            <FaDumbbell className="animate-bounce mx-2" />
            <h1 className="text-8xl font-extrabold">404</h1>
            <FaDumbbell className="animate-bounce mx-2" />
          </div>
          <h2 className="text-3xl font-bold mt-4">Admin Page Not Found</h2>
          <p className="text-gray-600">
            Looks like this admin page skipped leg day. It's missing or moved.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-block px-6 py-3  hover:bg-orange-100 text-orange-600 font-semibold rounded-lg shadow-md transition duration-300"
        >
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;

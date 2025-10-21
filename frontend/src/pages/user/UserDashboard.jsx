import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/utils';

function UserDashboard() {
  const { user } = useSelector((state) => state.authSlice);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Hey, <span className="text-indigo-600">{user.fullName}</span>
      </h1>
      <div className=" p-6 w-full max-w-md text-center">
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Full Name:</span> {user.fullName}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Account Created:</span> {formatDate(user.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default UserDashboard;
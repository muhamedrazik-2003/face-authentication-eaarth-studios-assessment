import React from "react";
import { getStatusClass } from "../../utils/utils";
import { useSelector } from "react-redux";

function AdminDashboard() {
    const { isLoading, user, error, isRegistering, allUsers } = useSelector((state) => state.authSlice)

  return (
    <main className="min-h-screen bg-gray-50 px-[90px] py-10">
      {/* Greeting */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome back, <span className="text-indigo-600">{user.fullName}</span>
        </h1>
        <p className="text-gray-500 mt-2">Here’s an overview of your users.</p>
      </header>

      {/* User Table */}
      <section className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold">ID</th>
              <th className="text-left px-6 py-3 text-sm font-semibold">Name</th>
              <th className="text-left px-6 py-3 text-sm font-semibold">Email</th>
              <th className="text-left px-6 py-3 text-sm font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
              <th className="text-left px-3 py-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-50 transition`}
              >
                <td className="px-6 py-3 text-sm text-gray-700">{user.id}</td>
                <td className="px-6 py-3 text-sm text-gray-800 font-medium">
                  {user.fullName}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className={getStatusClass(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className={getStatusClass(user.status)}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default AdminDashboard;

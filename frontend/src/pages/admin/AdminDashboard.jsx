import React, { useEffect, useState, useRef } from "react";
import { getStatusClass } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { changeAccountStatus, getAllUsers } from "../../redux/slices/AuthSlice";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import { toast } from "react-toastify";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user, allUsers } = useSelector((state) => state.authSlice);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!allUsers.length) dispatch(getAllUsers());
  }, [dispatch, allUsers.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangeUserStatus = async (status, userId) => {
    const response = await dispatch(changeAccountStatus({ status, userId }));
    if (changeAccountStatus.fulfilled.match(response)) {
      toast.success("User status updated");
      setActiveDropdown(null);
    } else {
      toast.error(response.payload?.message || "Failed to update user status");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-[90px] py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, <span className="text-indigo-600">{user.fullName}</span>
        </h1>
        <p className="text-gray-500 mt-2">Here’s an overview of your users.</p>
      </header>

      <section className="bg-white shadow-md">
        <div>
          <table className="min-w-full border-separate border-spacing-0">
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
              {allUsers.map((userItem, idx) => (
                <tr
                  key={userItem._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50 transition`}
                >
                  <td className="px-6 py-3 text-sm text-gray-700">#USR{userItem._id.slice(0, 5)}</td>
                  <td className="px-6 py-3 text-sm text-gray-800 font-medium">{userItem.fullName}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{userItem.email}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={getStatusClass(userItem.role)}>{userItem.role}</span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={getStatusClass(userItem.status)}>{userItem.status}</span>
                  </td>
                  <td className="pl-6 pr-2 py-3 text-sm relative" ref={dropdownRef}>
                    <button
                      onClick={() => setActiveDropdown(prev => (prev === userItem._id ? null : userItem._id))}
                      disabled={userItem.role === "admin"}
                    >
                      <Edit
                        className={`size-4 ${userItem.role === "admin"
                          ? "text-indigo-400 cursor-not-allowed"
                          : "text-indigo-700 cursor-pointer"
                        }`}
                      />
                    </button>

                    {activeDropdown === userItem._id && (
                      <div className="w-48 absolute top-0 right-6 bg-indigo-50 z-10 py-2 px-1 shadow-xl rounded-2xl border border-indigo-200">
                        <p className="text-indigo-400 border-b border-indigo-200 px-3 pb-2 mb-1">Change User Status</p>
                        {userItem.status !== "verified" && (
                          <p
                            onClick={() => handleChangeUserStatus("verified", userItem._id)}
                            className="px-4 py-2 flex gap-2 items-center hover:bg-indigo-200 active:bg-indigo-300 rounded-xl cursor-pointer"
                          >
                            <CheckCircle className="size-4 text-green-600" />Verify User
                          </p>
                        )}
                        {userItem.status !== "rejected" && (
                          <p
                            onClick={() => handleChangeUserStatus("rejected", userItem._id)}
                            className="px-4 py-2 flex gap-2 items-center text-red-600 hover:bg-indigo-200 active:bg-indigo-300 rounded-xl cursor-pointer"
                          >
                            <XCircle className="size-4 text-red-600" />Reject User
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
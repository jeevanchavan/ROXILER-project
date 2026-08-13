import React from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (err) {
      navigate("/login");
    }
  };

  const getBackPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "store_owner") return "/owner/dashboard";
    return "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-start font-sans text-gray-800">
      <div className="bg-white border border-gray-300 rounded shadow-sm p-6 w-full max-w-md space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => navigate(getBackPath())}
            className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium cursor-pointer"
          >
            &larr; Back
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Username</span>
            <span className="font-semibold text-gray-900 text-base">{user?.username || "N/A"}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Email</span>
            <span className="font-medium text-gray-900">{user?.email || "N/A"}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Address</span>
            <span className="font-medium text-gray-900">{user?.address || "N/A"}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Role</span>
            <span className="inline-block px-2.5 py-0.5 mt-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
              {(user?.role || "USER").toUpperCase()}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

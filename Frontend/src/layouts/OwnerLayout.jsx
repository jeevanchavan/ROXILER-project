import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const OwnerLayout = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans text-gray-800">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-gray-300 p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-800">Store Owner Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 border border-gray-300 rounded text-sm text-gray-700 bg-gray-50 cursor-pointer"
        >
          {sidebarOpen ? "Close Menu" : "Menu"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white border-r border-gray-300 flex-shrink-0 flex flex-col justify-between`}
      >
        <div>
          <div className="p-4 border-b border-gray-200 hidden md:block">
            <h1 className="font-bold text-xl text-gray-900">Store Owner</h1>
            <p className="text-xs text-gray-500 mt-1">Management Portal</p>
          </div>

          <nav className="p-4 space-y-1">
            <NavLink
              to="/owner/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm font-medium rounded ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Dashboard
            </NavLink>

            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            >
              Profile
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded font-medium border border-red-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white border-b border-gray-300 px-6 py-4 justify-between items-center">
          <div className="text-sm font-semibold text-gray-600">
            Welcome back, <span className="text-gray-900 font-bold">{user?.username || "Owner"}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-medium uppercase">
            {user?.role || "STORE_OWNER"}
          </span>
        </header>

        {/* Page View */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;

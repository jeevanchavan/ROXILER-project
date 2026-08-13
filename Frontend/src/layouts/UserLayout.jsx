import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const UserLayout = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/stores" className="font-bold text-lg text-gray-900">
            Store Finder
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/stores"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              Stores List
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              My Profile
            </NavLink>

            <div className="pl-4 border-l border-gray-300 flex items-center space-x-3">
              <span className="text-xs font-semibold text-gray-600">
                {user?.username || user?.email}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded cursor-pointer"
              >
                Logout
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-gray-300 rounded text-xs text-gray-700 bg-gray-50 cursor-pointer"
          >
            {mobileMenuOpen ? "Close Menu" : "Menu"}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 px-4 py-3 bg-white space-y-2">
            <NavLink
              to="/stores"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:bg-gray-50 py-1"
            >
              Stores List
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:bg-gray-50 py-1"
            >
              My Profile
            </NavLink>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left text-sm font-medium text-red-600 py-1"
            >
              Logout ({user?.username})
            </button>
          </div>
        )}
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;

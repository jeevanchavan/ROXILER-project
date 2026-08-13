import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const role = (user.role || "").toLowerCase();
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "store_owner") {
        navigate("/owner/dashboard", { replace: true });
      } else {
        navigate("/stores", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="w-full border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl text-gray-900">StoreRate</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Rate and Discover Local Stores Easily
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl">
          Find stores near you, read authentic reviews, and share your experience by leaving ratings and feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Login to Account
          </button>
        </div>

      </main>
    </div>
  );
};

export default Landing;

import React, { useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";

const AdminDashboard = () => {
  const { dashboard, loading, error, fetchDashboard } = useAdmin();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600 font-medium">
        Loading dashboard statistics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of system metrics</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded border border-gray-300 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {dashboard.totalUsers}
          </p>
        </div>

        {/* Total Stores Card */}
        <div className="bg-white p-6 rounded border border-gray-300 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Total Stores
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {dashboard.totalStores}
          </p>
        </div>

        {/* Total Ratings Card */}
        <div className="bg-white p-6 rounded border border-gray-300 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Total Ratings
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {dashboard.totalRatings}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

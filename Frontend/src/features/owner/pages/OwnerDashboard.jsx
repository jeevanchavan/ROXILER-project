import React, { useEffect } from "react";
import { useOwner } from "../hooks/useOwner";

const OwnerDashboard = () => {
  const { store, ratings, loading, error, fetchDashboard } = useOwner();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        Loading store dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
        {error}
      </div>
    );
  }

  if (!store) {
    return (
      <div className="bg-white border border-gray-300 rounded p-8 text-center text-gray-500 font-medium shadow-sm">
        No store assigned to your account yet. Please contact an Administrator.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Store Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of your store details and customer ratings</p>
      </div>

      {/* Store Info Cards */}
      <div className="bg-white border border-gray-300 rounded p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
          {store.storename}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Store Name</span>
            <span className="font-semibold text-gray-900">{store.storename}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Store Email</span>
            <span className="font-medium text-gray-900">{store.email}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Store Address</span>
            <span className="font-medium text-gray-900">{store.address || "N/A"}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Average Rating</span>
            <span className="font-bold text-blue-600 text-lg">
              {store.averageRating != null
                ? Number(store.averageRating).toFixed(1) + " / 5.0"
                : "No ratings yet"}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Ratings Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-md font-bold text-gray-800">Customer Ratings</h2>
          <p className="text-xs text-gray-500">Users who have rated your store</p>
        </div>

        {ratings.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium text-sm">
            No customer ratings submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-300 text-gray-800 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ratings.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.username || "Anonymous"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">
                      {item.rating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;

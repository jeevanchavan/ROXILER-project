import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";

const AdminUserDetails = () => {
  const { id } = useParams();
  const { userDetails, stores, loading, error, fetchUserById, fetchStores } = useAdmin();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
      fetchStores();
    }
  }, [id, fetchUserById, fetchStores]);

  // Find store owned by this user if they are a store_owner
  const ownedStore = useMemo(() => {
    if (!userDetails || !stores.length) return null;
    return stores.find(
      (s) => Number(s.owner_id) === Number(userDetails.id)
    );
  }, [userDetails, stores]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 font-medium">
        Loading user details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
        <Link
          to="/admin/users"
          className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
        >
          &larr; Back to Users
        </Link>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="space-y-4">
        <div className="p-6 text-center text-gray-500 font-medium bg-white border border-gray-300 rounded">
          User not found.
        </div>
        <Link
          to="/admin/users"
          className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
        >
          &larr; Back to Users
        </Link>
      </div>
    );
  }

  const isStoreOwner = (userDetails.role || "").toLowerCase() === "store_owner";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header and Back Link */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          <p className="text-sm text-gray-600">Detailed information for user #{userDetails.id}</p>
        </div>
        <Link
          to="/admin/users"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
        >
          &larr; Back to Users
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-gray-300 rounded p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">{userDetails.username}</h2>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded ${
              isStoreOwner
                ? "bg-blue-100 text-blue-800"
                : userDetails.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {(userDetails.role || "").toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">User ID</span>
            <span className="font-medium text-gray-900">{userDetails.id}</span>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-500 uppercase">Email</span>
            <span className="font-medium text-gray-900">{userDetails.email}</span>
          </div>

          <div className="sm:col-span-2">
            <span className="block text-xs font-semibold text-gray-500 uppercase">Address</span>
            <span className="font-medium text-gray-900">{userDetails.address || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Additional Card for STORE_OWNER */}
      {isStoreOwner && (
        <div className="bg-white border border-blue-200 rounded p-6 shadow-sm space-y-4">
          <h2 className="text-md font-bold text-gray-900 border-b border-gray-200 pb-2">
            Store Owner Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase">Store Name</span>
              <span className="font-medium text-gray-900">
                {ownedStore ? ownedStore.storename : "No store assigned yet"}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase">Store Email</span>
              <span className="font-medium text-gray-900">
                {ownedStore ? ownedStore.email : "N/A"}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase">Store Address</span>
              <span className="font-medium text-gray-900">
                {ownedStore ? ownedStore.address : "N/A"}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase">Average Rating</span>
              <span className="font-bold text-blue-600 text-base">
                {userDetails.averageRating != null
                  ? Number(userDetails.averageRating).toFixed(1) + " / 5.0"
                  : ownedStore && ownedStore.average_rating != null
                  ? Number(ownedStore.average_rating).toFixed(1) + " / 5.0"
                  : "No ratings yet"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;

import React, { useEffect, useState, useMemo } from "react";
import { useStores } from "../hooks/useStores";
import StarRating from "../../../components/StarRating";
import RatingModal from "../../../components/RatingModal";

const Stores = () => {
  const { stores, loading, error, fetchStores, rateStore } = useStores();

  // Search States
  const [nameQuery, setNameQuery] = useState("");
  const [addressQuery, setAddressQuery] = useState("");

  // Rating Modal State
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Client-side search filtering by store name and address
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchName = (store.storename || "")
        .toLowerCase()
        .includes(nameQuery.toLowerCase().trim());
      const matchAddress = (store.address || "")
        .toLowerCase()
        .includes(addressQuery.toLowerCase().trim());
      return matchName && matchAddress;
    });
  }, [stores, nameQuery, addressQuery]);

  const handleOpenRatingModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (storeId, rating, isUpdate) => {
    await rateStore(storeId, rating, isUpdate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore Stores</h1>
        <p className="text-sm text-gray-600">
          Find registered stores, view overall community ratings, and submit your own rating.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Search Filter Controls */}
      <div className="bg-white p-4 rounded border border-gray-300 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Search by Store Name
          </label>
          <input
            type="text"
            placeholder="Type store name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Search by Address
          </label>
          <input
            type="text"
            placeholder="Type address..."
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stores List / Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading stores...</div>
        ) : filteredStores.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            {stores.length === 0 ? "No stores available yet." : "No stores match your search criteria."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-300 text-gray-800 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Store Name</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Overall Rating</th>
                  <th className="px-4 py-3">My Rating</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStores.map((store) => {
                  const hasRated = store.my_rating != null && Number(store.my_rating) > 0;
                  const avgRating = Number(store.average_rating || 0);

                  return (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {store.storename}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{store.address || "N/A"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <StarRating value={Math.round(avgRating)} readOnly size="text-sm" />
                          <span className="font-bold text-gray-900 text-xs">
                            {avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0` : "No ratings"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {hasRated ? (
                          <div className="flex items-center space-x-1">
                            <StarRating value={Number(store.my_rating)} readOnly size="text-sm" />
                            <span className="text-xs font-bold text-blue-600">
                              ({store.my_rating}★)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Not rated</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenRatingModal(store)}
                          className={`px-3 py-1 text-xs font-medium rounded border cursor-pointer ${
                            hasRated
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                              : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          }`}
                        >
                          {hasRated ? "Edit Rating" : "Rate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default Stores;

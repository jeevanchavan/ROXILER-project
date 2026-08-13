import React, { useEffect, useState, useMemo } from "react";
import { useAdmin } from "../hooks/useAdmin";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Modal from "../../../components/Modal";

const AdminStores = () => {
  const { stores, users, loading, error, setError, fetchStores, fetchUsers, addStore } = useAdmin();

  // Search, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("storename");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add Store Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    storename: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, [fetchStores, fetchUsers]);

  // Filter users to only those with role === "store_owner"
  const storeOwners = useMemo(() => {
    return users.filter(
      (u) => (u.role || "").toLowerCase() === "store_owner"
    );
  }, [users]);

  // Options for Store Owner Select dropdown
  const storeOwnerOptions = useMemo(() => {
    return storeOwners.map((owner) => ({
      value: owner.id,
      label: `${owner.username} (${owner.email})`,
    }));
  }, [storeOwners]);

  // Handle Form Input Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate Add Store Form
  const validateForm = () => {
    const errors = {};

    if (!formData.storename.trim()) {
      errors.storename = "Store Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email";
      }
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.ownerId) {
      errors.ownerId = "Store Owner is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Add Store Submit
  const handleAddStoreSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addStore({
        storename: formData.storename,
        email: formData.email,
        address: formData.address,
        ownerId: Number(formData.ownerId),
      });
      setIsModalOpen(false);
      setFormData({
        storename: "",
        email: "",
        address: "",
        ownerId: "",
      });
      setFormErrors({});
    } catch (err) {
      // Error handled in hook or displayed
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side Filtering, Search, Sorting
  const processedStores = useMemo(() => {
    let result = [...stores];

    // Search by storename, email, address
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          (s.storename || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.address || "").toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = (a[sortField] || "").toString().toLowerCase();
      let valB = (b[sortField] || "").toString().toLowerCase();

      if (sortField === "average_rating") {
        valA = Number(a.average_rating || 0);
        valB = Number(b.average_rating || 0);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [stores, searchQuery, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(processedStores.length / itemsPerPage) || 1;
  const currentStores = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedStores.slice(start, start + itemsPerPage);
  }, [processedStores, currentPage, itemsPerPage]);

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stores Management</h1>
          <p className="text-sm text-gray-600">View and manage all registered stores</p>
        </div>
        <Button
          fullWidth={false}
          onClick={() => {
            setIsModalOpen(true);
            setError("");
          }}
          className="cursor-pointer px-4 py-2"
        >
          + Add Store
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Controls: Search & Sorting */}
      <div className="bg-white p-4 rounded border border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by store name, email, address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Sort By</label>
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
            >
              <option value="storename">Store Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="average_rating">Average Rating</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 hover:bg-gray-100 font-semibold"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white border border-gray-300 rounded overflow-x-auto shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading stores...</div>
        ) : currentStores.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No stores found.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-300 text-gray-800 font-semibold uppercase text-xs">
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortChange("storename")}
                >
                  Store Name {sortField === "storename" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortChange("email")}
                >
                  Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortChange("address")}
                >
                  Address {sortField === "address" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-right"
                  onClick={() => handleSortChange("average_rating")}
                >
                  Average Rating {sortField === "average_rating" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{store.storename}</td>
                  <td className="px-4 py-3 text-gray-600">{store.email}</td>
                  <td className="px-4 py-3 text-gray-600">{store.address || "N/A"}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">
                    {store.average_rating != null
                      ? Number(store.average_rating).toFixed(1)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {!loading && processedStores.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, processedStores.length)} to{" "}
              {Math.min(currentPage * itemsPerPage, processedStores.length)} of {processedStores.length} stores
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-xs text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Store Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Store"
      >
        <form onSubmit={handleAddStoreSubmit}>
          <Input
            label="Store Name"
            id="storename"
            name="storename"
            placeholder="Enter store name"
            value={formData.storename}
            onChange={handleFormChange}
            error={formErrors.storename}
            required
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter store email"
            value={formData.email}
            onChange={handleFormChange}
            error={formErrors.email}
            required
          />

          <Input
            label="Address"
            id="address"
            name="address"
            placeholder="Enter store address"
            value={formData.address}
            onChange={handleFormChange}
            error={formErrors.address}
            required
          />

          <Select
            label="Store Owner"
            id="ownerId"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleFormChange}
            options={storeOwnerOptions}
            placeholder={
              storeOwnerOptions.length === 0
                ? "No STORE_OWNER users available"
                : "Select a store owner"
            }
            error={formErrors.ownerId}
            required
          />

          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              fullWidth={true}
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={storeOwnerOptions.length === 0}
              fullWidth={true}
            >
              Save Store
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStores;

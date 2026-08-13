import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Modal from "../../../components/Modal";

const AdminUsers = () => {
  const { users, loading, error, setError, fetchUsers, addUser } = useAdmin();

  // Search, Filter, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate Add User Form
  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Name (username) is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
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

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add User Form
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addUser(formData);
      setIsModalOpen(false);
      setFormData({
        username: "",
        email: "",
        address: "",
        password: "",
        role: "user",
      });
      setFormErrors({});
    } catch (err) {
      // Error handled by hook or set locally
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side Filter, Search, Sort
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Filter by role
    if (roleFilter !== "ALL") {
      result = result.filter(
        (u) => (u.role || "").toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Search by name, email, address
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          (u.username || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.address || "").toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = (a[sortField] || "").toString().toLowerCase();
      let valB = (b[sortField] || "").toString().toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, roleFilter, searchQuery, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage) || 1;
  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedUsers.slice(start, start + itemsPerPage);
  }, [processedUsers, currentPage, itemsPerPage]);

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
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-sm text-gray-600">View and manage all system users</p>
        </div>
        <Button
          fullWidth={false}
          onClick={() => {
            setIsModalOpen(true);
            setError("");
          }}
          className="cursor-pointer px-4 py-2"
        >
          + Add User
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Controls: Search, Filter, Sorting */}
      <div className="bg-white p-4 rounded border border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name, email, address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Role Filter</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="user">USER</option>
            <option value="admin">ADMIN</option>
            <option value="store_owner">STORE_OWNER</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Sort By</label>
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
            >
              <option value="username">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
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

      {/* Users Table */}
      <div className="bg-white border border-gray-300 rounded overflow-x-auto shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading users...</div>
        ) : currentUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No users found.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-300 text-gray-800 font-semibold uppercase text-xs">
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortChange("username")}
                >
                  Name {sortField === "username" && (sortOrder === "asc" ? "▲" : "▼")}
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
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortChange("role")}
                >
                  Role {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.address || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "store_owner"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {(user.role || "").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 underline font-medium text-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {!loading && processedUsers.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, processedUsers.length)} to{" "}
              {Math.min(currentPage * itemsPerPage, processedUsers.length)} of {processedUsers.length} users
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

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleAddUserSubmit}>
          <Input
            label="Name (Username)"
            id="username"
            name="username"
            placeholder="Enter name"
            value={formData.username}
            onChange={handleFormChange}
            error={formErrors.username}
            required
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleFormChange}
            error={formErrors.email}
            required
          />

          <Input
            label="Address"
            id="address"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleFormChange}
            error={formErrors.address}
            required
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleFormChange}
            error={formErrors.password}
            required
          />

          <Select
            label="Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            options={[
              { value: "user", label: "USER" },
              { value: "admin", label: "ADMIN" },
              { value: "store_owner", label: "STORE_OWNER" },
            ]}
            error={formErrors.role}
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
            <Button type="submit" loading={isSubmitting} fullWidth={true}>
              Save User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;

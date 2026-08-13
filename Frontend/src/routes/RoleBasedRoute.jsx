import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8 text-center font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || "").toLowerCase();
    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );
    if (!hasRole) {
      if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
      if (userRole === "store_owner") return <Navigate to="/owner/dashboard" replace />;
      return <Navigate to="/stores" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default RoleBasedRoute;

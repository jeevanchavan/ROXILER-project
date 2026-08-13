import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Profile from "../pages/Profile";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleBasedRoute from "../routes/RoleBasedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminUsers from "../features/admin/pages/AdminUsers";
import AdminUserDetails from "../features/admin/pages/AdminUserDetails";
import AdminStores from "../features/admin/pages/AdminStores";
import OwnerLayout from "../layouts/OwnerLayout";
import OwnerDashboard from "../features/owner/pages/OwnerDashboard";

import UserLayout from "../layouts/UserLayout";
import Stores from "../features/stores/pages/Stores";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        )
    },
    {
        path: "/stores",
        element: (
            <RoleBasedRoute allowedRoles={["USER"]}>
                <UserLayout />
            </RoleBasedRoute>
        ),
        children: [
            {
                index: true,
                element: <Stores />
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminLayout />
            </RoleBasedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "users",
                element: <AdminUsers />
            },
            {
                path: "users/:id",
                element: <AdminUserDetails />
            },
            {
                path: "stores",
                element: <AdminStores />
            }
        ]
    },
    {
        path: "/owner",
        element: (
            <RoleBasedRoute allowedRoles={["store_owner"]}>
                <OwnerLayout />
            </RoleBasedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/owner/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <OwnerDashboard />
            }
        ]
    }
]);



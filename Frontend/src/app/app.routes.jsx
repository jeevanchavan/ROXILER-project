import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminUsers from "../features/admin/pages/AdminUsers";
import AdminUserDetails from "../features/admin/pages/AdminUserDetails";
import AdminStores from "../features/admin/pages/AdminStores";

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
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
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
    }
]);



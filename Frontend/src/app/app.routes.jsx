import { createBrowserRouter } from "react-router";
import Landing from "../pages/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

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
    }
])

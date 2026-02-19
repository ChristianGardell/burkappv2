// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@layout/Layout";
import Home from "@pages/Home";
import Buy from "@pages/Buy";
import Login from "@pages/Login";
import Signup from "@pages/Signup";
import CreateGroup from "@pages/CreateGroup";
import Admin from "@pages/Admin";
import Stats from "@pages/Stats";
import OwnerSettings from "@/pages/owner-settings/OwnerSettings";
import ProtectedRoute from "./lib/protectedRoute";
import AdminRoute from "./lib/adminRoute";
import RedirectHome from "./lib/redirectHome";
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <RedirectHome>
        <Login />
      </RedirectHome>
    ),
  },
  {
    path: "/signup",
    element: (
      <RedirectHome>
        <Signup />
      </RedirectHome>
    ),
  },
  {
    path: "/create-group",
    element: (
      <RedirectHome>
        <CreateGroup />
      </RedirectHome>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "/home", element: <Home /> },
      { path: "/buy", element: <Buy /> },
    ],
  },
  {
    path: "/",
    element: (
      <AdminRoute>
        <Layout />
      </AdminRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "/admin", element: <Admin /> },
      { path: "/stats", element: <Stats /> },
      { path: "/settings", element: <OwnerSettings /> },
    ],
  },
]);

export default router;

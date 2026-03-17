// src/router.tsx
import Layout from "@layout/Layout";
import Admin from "@/pages/admin/Admin";
import Buy from "@pages/Buy";
import CreateGroup from "@pages/CreateGroup";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Signup from "@/pages/Signup";
import Stats from "@/pages/stats/Stats";
import InviteCodeSignUp from "@/pages/InviteCodeSignUp";
import { createBrowserRouter, Navigate } from "react-router-dom";

import OwnerSettings from "@/pages/settings/OwnerSettings";

import AdminRoute from "./lib/adminRoute";
import OwnerRoute from "./lib/ownerRoute";
import ProtectedRoute from "./lib/protectedRoute";
import RedirectHome from "./lib/redirectHome";

const router = createBrowserRouter([
  // Public Routes (Unprotected)
  {
    element: <RedirectHome />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/join", element: <InviteCodeSignUp /> },
      { path: "/join/:inviteCode?", element: <Signup /> },
      { path: "/create-group", element: <CreateGroup /> },
    ],
  },

  // Protected Routes (Uses Layout)
  {
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

  // Admin Routes (Uses Layout)
  {
    element: (
      <AdminRoute>
        <Layout />
      </AdminRoute>
    ),
    children: [
      { path: "/admin", element: <Admin /> },
      { path: "/stats", element: <Stats /> },
    ],
  },

  // Owner Routes (Uses Layout)
  {
    element: (
      <OwnerRoute>
        <Layout />
      </OwnerRoute>
    ),
    children: [{ path: "/settings", element: <OwnerSettings /> }],
  },

  // Fallback
  { path: "*", element: <Navigate to="/home" replace /> },
]);

export default router;

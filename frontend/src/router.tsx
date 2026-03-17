// src/router.tsx
import Layout from "@layout/Layout";
import Admin from "@/pages/admin/Admin";
import Buy from "@/pages/user/Buy/BuyPage";
import CreateGroup from "@/pages/auth/CreateGroup/CreateGroupPage";
import Home from "@/pages/user/Home/HomePage";
import Login from "@/pages/auth/Login/LoginPage";
import Signup from "@/pages/auth/Signup/SignupPage";
import Stats from "@/pages/stats/Stats";
import InviteCodeSignUp from "@/pages/auth/InviteCode/InviteCodePage";
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

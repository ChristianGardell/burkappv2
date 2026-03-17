// src/router.tsx
import Layout from "@layout/Layout";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Admin from "@/pages/admin/Admin";
import CreateGroup from "@/pages/auth/CreateGroup/CreateGroupPage";
import InviteCodeSignUp from "@/pages/auth/InviteCode/InviteCodePage";
import Login from "@/pages/auth/Login/LoginPage";
import Signup from "@/pages/auth/Signup/SignupPage";
import OwnerSettings from "@/pages/settings/OwnerSettings";
import UserSettings from "@/pages/settings/UserSettings";
import Stats from "@/pages/stats/Stats";
import Buy from "@/pages/user/Buy/BuyPage";
import Home from "@/pages/user/Home/HomePage";

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
      { path: "/settings", element: <UserSettings /> },
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
    children: [{ path: "/group-settings", element: <OwnerSettings /> }],
  },

  // Fallback
  { path: "*", element: <Navigate to="/home" replace /> },
]);

export default router;

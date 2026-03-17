// src/router.tsx
import Layout from "@layout/Layout";
import Admin from "@/pages/admin/Admin";
import Buy from "@pages/Buy";
import CreateGroup from "@pages/CreateGroup";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Signup from "@/pages/DetailsSignup";
import Stats from "@/pages/stats/Stats";
import InviteCodeSignUp from "@/pages/InviteCodeSignUp";
import { createBrowserRouter, Navigate } from "react-router-dom";

import OwnerSettings from "@/pages/settings/OwnerSettings";

import AdminRoute from "./lib/adminRoute";
import OwnerRoute from "./lib/ownerRoute";
import ProtectedRoute from "./lib/protectedRoute";
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
    path: "/join",
    element: (
      <RedirectHome>
        <InviteCodeSignUp />
      </RedirectHome>
    ),
  },
  {
    path: "/join/:inviteCode?",
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
    ],
  },
  {
    path: "/",
    element: (
      <OwnerRoute>
        <Layout />
      </OwnerRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "/settings", element: <OwnerSettings /> },
    ],
  },
]);

export default router;

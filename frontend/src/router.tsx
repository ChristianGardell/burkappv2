// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@layout/Layout";
import Home from "@pages/Home";
import Buy from "@pages/Buy";
import Login from "@pages/Login";
import Signup from "@pages/Signup";
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
    path: "/signup",
    element: (
      <RedirectHome>
        <Signup />
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
]);

export default router;

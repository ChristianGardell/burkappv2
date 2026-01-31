// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "@layout/Layout";
import Home from "@pages/Home";
import Buy from "@pages/Buy";
import Login from "@pages/Login";
import Signup from "@pages/Signup";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/buy", element: <Buy /> },
    ],
  },
]);

export default router;

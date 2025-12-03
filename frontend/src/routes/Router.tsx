// Ensure JSX is enabled via tsconfig
import { createBrowserRouter, Navigate } from "react-router";
import Login from "../pages/Login";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "*", element: <Navigate to="/" /> },
]);

export default router;
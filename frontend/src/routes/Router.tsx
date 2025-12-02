import { createBrowserRouter } from "react-router";
import Login from "../pages/Login.tsx";

const router = createBrowserRouter([
	{ path: "/login", element: <Login /> },

])

export default router;
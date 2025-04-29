// src/components/PrivateRoute.js
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // or use context if needed

  // If not logged in, go to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access to children via <Outlet />
  return <Outlet />;
};

export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminRoute = () => {
  const { user, loading } = useUser();

  if (loading) return null;

  // Check the role carefully - use lowercase to be safe
  const isAdmin = user?.role?.toLowerCase() === "admin";

  if (!user || !isAdmin) {
    console.log("🚫 ADMIN ACCESS DENIED: ", user);
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
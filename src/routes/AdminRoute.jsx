import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminRoute = () => {
  const { user, loading } = useUser();

  // wait for UserContext to finish syncing before deciding access
  if (loading) return null;

  // normalize role to lowercase for safe comparison
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // if user is missing or doesn't have the admin flag, bounce them to /home
  if (!user || !isAdmin) {
    console.log("🚫 admin access denied: ", user);
    // replace ensures they can't click "back" to get into the admin panel
    return <Navigate to="/home" replace />;
  }

  // if everything checks out, render the protected admin children (Outlet)
  return <Outlet />;
};

export default AdminRoute;
import { Navigate, Outlet } from "react-router-dom"; // Add Outlet
import { useUser } from "../context/UserContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  if (user) {
    return user.onboarded 
      ? <Navigate to="/home" replace /> 
      : <Navigate to="/get-started" replace />;
  }

  // If children exist (component wrapper), use them. 
  // Otherwise, use Outlet (layout wrapper).
  return children ? children : <Outlet />;
};

export default GuestRoute;
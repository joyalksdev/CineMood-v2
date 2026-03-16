import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  // If user exists, send them away from Login/Register
  if (user) {
    return user.onboarded ? <Navigate to="/home" replace /> : <Navigate to="/get-started" replace />;
  }

  return children;
};

export default GuestRoute;
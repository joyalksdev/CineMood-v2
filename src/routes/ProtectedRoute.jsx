import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    // IMPORTANT: Only redirect to login if they are trying to hit a private app page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.onboarded) {
    return <Navigate to="/get-started" replace />;
  }

  return children;
};
export default ProtectedRoute;
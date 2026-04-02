import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // wait for auth to finish before redirecting
  if (loading) return null;

  // if no user, kick to login but save their current page for later
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if logged in but not setup, force them to get-started
  if (!user.onboarded) {
    return <Navigate to="/get-started" replace />;
  }

  // user is legit and setup—let 'em in
  return children;
};

export default ProtectedRoute;
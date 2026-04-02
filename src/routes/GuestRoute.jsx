import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useUser();

  // wait for the neural link (UserContext) to sync before redirecting
  if (loading) return null;

  // if a user session exists, redirect them based on their setup progress
  if (user) {
    return user.onboarded 
      ? <Navigate to="/home" replace /> // fully setup users go to dashboard
      : <Navigate to="/get-started" replace />; // new users finish onboarding
  }

  /* Flexibility check:
     1. if used as <GuestRoute><LoginPage /></GuestRoute>, it renders 'children'.
     2. if used in App.js as an element={ <GuestRoute /> }, it renders the 'Outlet'.
  */
  return children ? children : <Outlet />;
};

export default GuestRoute;
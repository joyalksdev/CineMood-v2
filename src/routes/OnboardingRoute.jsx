import { Navigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const OnboardingRoute = ({ children }) => {
  const { user, loading } = useUser()
  
  // wait for the UserContext to finish syncing
  if (loading) return null

  // if no user is found, they shouldn't be here—send to login
  if (!user) return <Navigate to="/login" />

  // if the user has already completed the setup, don't let them re-enter
  // send them straight to the main homepage
  if (user.onboarded) return <Navigate to="/home" />

  // if they are logged in but NOT onboarded, let them see the setup screens
  return children
}

export default OnboardingRoute
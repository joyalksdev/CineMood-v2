import { Navigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const OnboardingRoute = ({ children }) => {
  const { user, loading } = useUser()
  if (loading) return null

  if (!user) return <Navigate to="/login" />
  if (user.onboarded) return <Navigate to="/home" />

  return children
}

export default OnboardingRoute

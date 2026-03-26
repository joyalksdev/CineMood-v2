import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import BrowseMovies from "./pages/BrowseMovies";
import Watchlist from "./pages/Watchlist";
import GetStarted from "./pages/GetStarted";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useUser } from "./context/UserContext";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import OnboardingRoute from "./routes/OnboardingRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CastCrewDetails from "./pages/CastCrewDetails";
import PersonDetails from "./pages/PersonDetails";
import MovieReviews from "./pages/MovieReviews";
import MoodResults from "./pages/MoodResults";
import { Toaster } from "react-hot-toast";
import MovieRowPage from "./pages/MovieRowPage";
import ForgotPassword from "./pages/ForgotPassword";
import GuestRoute from "./routes/GuestRoute"; // Ensure this is imported
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import VibeSearch from "./pages/VibeSearch";
import ResetPassword from "./pages/ResetPassword";
import WeeklySpotlight from "./components/sections/WeeklySpotlight";
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersList from './pages/admin/AdminUsersList'
import AdminReviewList from './pages/admin/AdminReviewList'
import AdminBroadcast from './pages/admin/AdminBroadcast'
import AdminRoute from "./routes/AdminRoute";
import AdminLogs from "./pages/admin/AdminLogs";

const App = () => {
  const { user, loading } = useUser();

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  // Prevent flicker during session check
  if (loading) return null;

  return (
    <>
     <Toaster
      position="top-center"
      toastOptions={{
        // Apply the Glassmorphism style here
        style: {
          background: 'rgba(255, 255, 255, 0.05)', // Semi-transparent white
          backdropFilter: 'blur(12px)',           // The glass blur
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',                         // White text
          borderRadius: '16px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        },
        success: {
          // Highlight success with your brand yellow
          iconTheme: {
            primary: '#FFC509',
            secondary: '#000',
          },
          style: {
            borderLeft: '4px solid #FFC509', // Nice yellow accent bar
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #ef4444', // Red accent bar for errors
          },
        },
      }}
    />
      <Routes>

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> 
            <Route path="users" element={<AdminUsersList />} /> 
            <Route path="reviews" element={<AdminReviewList />} />
            <Route path="broadcast" element={<AdminBroadcast />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </Route>


        {/* 1. PUBLIC & SMART REDIRECT: Landing Page */}
        <Route
          path="/"
          index // Add the index prop here
          element={
            user ? (
              user.onboarded ? <Navigate to="/home" replace /> : <Navigate to="/get-started" replace />
            ) : (
              <Landing />
            )
          }
        />

        {/* 2. AUTH ROUTES: Redirects logged-in users to /home automatically */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 3. ONBOARDING: Protected specifically for new logged-in users */}
        <Route
          path="/get-started"
          element={
            <OnboardingRoute>
              <GetStarted />
            </OnboardingRoute>
          }
        />

        {/* 4. PROTECTED APP ROUTES: Requires Login + Onboarding Completion */}
        <Route
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/ai" element={<VibeSearch />} />
          <Route path="/weekly-spotlight" element={<WeeklySpotlight />} />
          <Route path="/browse" element={<BrowseMovies />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movies/:type" element={<MovieRowPage />} />
          <Route path="/movie/:id/cast-crew" element={<CastCrewDetails />} />
          <Route path="/person/:id" element={<PersonDetails />} />
          <Route path="/movie/:id/reviews" element={<MovieReviews />} />
          <Route path="/mood/:type" element={<MoodResults />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 5. CATCH ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
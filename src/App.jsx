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
import GuestRoute from "./routes/GuestRoute"; 
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import VibeSearch from "./pages/VibeSearch";
import ResetPassword from "./pages/ResetPassword";
import WeeklySpotlight from "./components/sections/WeeklySpotlight";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AdminReviewList from "./pages/admin/AdminReviewList";
import AdminBroadcast from "./pages/admin/AdminBroadcast";
import AdminRoute from "./routes/AdminRoute";
import AdminLogs from "./pages/admin/AdminLogs";
import PublicLayout from "./components/layout/PublicLayout";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/utils/ScrollToTop";
import HelpPage from "./pages/HelpPage";
import LegalDocs from "./pages/LegalDocs";

const App = () => {
  const { user, loading } = useUser();

  useEffect(() => {
  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    lerp: 0.1, 
  });

  //  Handle Animation Frame with a mounting guard
  let rafId;
  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  // We use a debounce-style approach so it doesn't lag during heavy API loads
  const resizeObserver = new ResizeObserver(() => {
    // Small delay ensures DOM is fully painted before Lenis measures it
    setTimeout(() => {
      lenis.resize();
    }, 100);
  });
  
  // Observe both the body and the #root to be safe
  resizeObserver.observe(document.body);
  const rootElement = document.getElementById('root');
  if (rootElement) resizeObserver.observe(rootElement);

  //  Global access for your Landing/Spotlight buttons
  window.lenis = lenis;

  //  Cleanup
  return () => {
    lenis.destroy();
    cancelAnimationFrame(rafId);
    resizeObserver.disconnect();
    window.lenis = null;
  };
}, []);
  
  // Prevent flicker during session check
  if (loading) return null;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          // Apply the Glassmorphism style here
          style: {
            background: "rgba(255, 255, 255, 0.05)", // Semi-transparent white
            backdropFilter: "blur(12px)", // The glass blur
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff", // White text
            borderRadius: "16px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          },
          success: {
            // Highlight success with your brand yellow
            iconTheme: {
              primary: "#FFC509",
              secondary: "#000",
            },
            style: {
              borderLeft: "4px solid #FFC509", // Nice yellow accent bar
            },
          },
          error: {
            style: {
              borderLeft: "4px solid #ef4444", // Red accent bar for errors
            },
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        {/* --- 1. ADMIN SECTION --- */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersList />} />
            <Route path="reviews" element={<AdminReviewList />} />
            <Route path="broadcast" element={<AdminBroadcast />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </Route>

        {/* --- 2. PUBLIC & GUEST SECTION (All Under PublicLayout) --- */}
        <Route element={<PublicLayout />}>
          {/* Smart Landing Logic */}
          <Route
            path="/"
            element={
              user ? (
                user.onboarded ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/get-started" replace />
                )
              ) : (
                <Landing />
              )
            }
          />

          {/* Static Public Pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/legal" element={<LegalDocs />} />

          {/* Auth Pages (Wrapped in GuestRoute to block logged-in users) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* --- 3. ONBOARDING (Special Case) --- */}
        <Route
          path="/get-started"
          element={
            <OnboardingRoute>
              <GetStarted />
            </OnboardingRoute>
          }
        />

        {/* --- 4. PROTECTED APP SECTION --- */}
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

        {/* --- 5. CATCH ALL --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;

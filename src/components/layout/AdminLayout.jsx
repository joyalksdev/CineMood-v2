import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import { useUser } from "../../context/UserContext";

const AdminLayout = () => {
  // get user and loading state from context
  const { user, loading } = useUser();

  // loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#FFC509]/20 border-t-[#FFC509] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFC509] animate-pulse">
            Syncing Neural Link...
          </p>
        </div>
      </div>
    );
  }

  // kick out anyone who isnt an admin
  if (!user || user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* sidebar stays fixed on the left */}
      <AdminSidebar />

      {/* main area with margin to not overlap the sidebar */}
      <main className="flex-1 w-full lg:ml-72 transition-all duration-300">
        {/* padding shifts for mobile vs desktop and max width for big screens */}
        <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto min-h-screen">
          {/* where admin sub-pages render */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
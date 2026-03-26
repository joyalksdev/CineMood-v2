import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import { useUser } from "../../context/UserContext";

const AdminLayout = () => {
  const { user, loading } = useUser();

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

  // Strictly check for admin role
  if (!user || user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* 1. Fixed Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      {/* Added 'lg:ml-72' to push content to the right of the fixed sidebar on desktop */}
      <main className="flex-1 w-full lg:ml-72 transition-all duration-300">
        {/* - pt-24 on mobile to clear the fixed top bar (h-16 + extra spacing)
          - pt-10 on desktop for a clean top margin
        */}
        <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto min-h-screen">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
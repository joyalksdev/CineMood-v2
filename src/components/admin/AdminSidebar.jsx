import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, MessageSquare, BellRing, 
  LogOut, ChevronRight, Activity, Menu, X, 
  ExternalLink, ChevronUp, UserCircle 
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useUser } from "../../context/UserContext";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Close sidebar/dropdown on route change or click outside
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: MessageSquare },
    { name: "System Logs", path: "/admin/logs", icon: Activity },
    { name: "Notifications", path: "/admin/broadcast", icon: BellRing },
  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-[70]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-6" />
          <span className="text-white font-bold italic text-sm tracking-tighter">
            CINE<span className="text-[#FFC509]">MOOD</span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/5 text-[#FFC509] border border-white/10 active:scale-90 transition-transform"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- OVERLAY --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- FIXED SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 z-[65]
        w-72 h-screen bg-[#050505] border-r border-white/5 
        flex flex-col p-6 transition-all duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Branding Section */}
        <div className="hidden lg:flex mb-12 px-2 items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 brightness-110 shadow-[0_0_20px_rgba(255,197,9,0.2)]" />
          <div>
            <h2 className="text-white font-bold text-xl leading-tight tracking-tight">
              Cine<span className="text-[#FFC509]">Mood</span>
            </h2>
            <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-600 font-black">Admin panel</p>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden mb-8 pt-4 flex items-center justify-between">
            <span className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.2em]">System Navigation</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 ${
                isActive(item.path)
                  ? "bg-[#FFC509] text-black shadow-xl shadow-[#FFC509]/10 translate-x-1"
                  : "text-neutral-500 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={19} className={isActive(item.path) ? "text-black" : "group-hover:text-[#FFC509] transition-colors"} />
                <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
              </div>
              {isActive(item.path) && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          ))}
        </nav>

        {/* Footer: Multi-option Logout Dropdown */}
        <div className="mt-auto pt-6 border-t border-white/5 relative" ref={menuRef}>
          
          {/* Action Menu (Popup) */}
          {showProfileMenu && (
            <div className="absolute bottom-24 left-0 w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-50 backdrop-blur-xl">
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white transition-all text-xs font-bold"
              >
                <ExternalLink size={14} className="text-[#FFC509]" />
                Exit to Cinemood
              </Link>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-neutral-300 hover:text-red-500 transition-all text-xs font-bold mt-1"
              >
                <LogOut size={14} />
                Sign Out Completely
              </button>
            </div>
          )}

          {/* User Profile Button */}
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-full group bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex items-center justify-between transition-all duration-300 hover:border-white/10 ${showProfileMenu ? 'bg-white/[0.05] ring-1 ring-white/10' : ''}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-[#FFC509] to-orange-500 flex items-center justify-center font-bold text-black text-sm shadow-xl">
                 {user?.name?.charAt(0) || "A"}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-white font-bold text-xs truncate">{user?.name || "Admin"}</p>
                <div className="flex items-center gap-1.5 text-[9px] text-green-500 font-bold uppercase tracking-widest mt-0.5">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Active
                </div>
              </div>
            </div>
            <ChevronUp size={14} className={`text-neutral-600 transition-transform duration-500 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
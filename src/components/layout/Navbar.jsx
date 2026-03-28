import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { HiOutlineSearch, HiOutlineMenuAlt3, HiX } from "react-icons/hi"
import DropDownProfile from '../ui/DropDownProfile'
import { useUser } from '../../context/UserContext'
import SearchBar from '../search/SearchBar'
import { Bell, Sparkle } from "lucide-react";
import { useNotifications } from '../../hooks/useNotifications'
import NotificationDrawer from '../notification/NotificationDrawer' 
import NotificationTrigger from '../notification/NotificationTrigger'
import api from '../../services/axios'
import toast from 'react-hot-toast'

const linkStyle = ({isActive}) => 
  `px-4 py-1.5 rounded-full transition-all border border-transparent duration-200 text-sm font-medium ${
    isActive 
      ? "bg-white/10 text-[#FFC509] border border-white/10 backdrop-blur-md" 
      : "text-neutral-300 hover:text-white border hover:border-yellow-400/50 hover:bg-white/10"
  }`;

  const aiLinkStyle = ({isActive}) => 
  `px-4 py-1.5 rounded-full transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
    isActive 
      ? "bg-[#FFC509]/20 text-[#FFC509] border border-[#FFC509]/50 shadow-[0_0_15px_rgba(255,197,9,0.3)]" 
      : "text-neutral-300 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
  }`;

  
const Navbar = () => {
  const {user} = useUser()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { notifications, unreadCount, refresh, loading } = useNotifications()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

 const handleMarkRead = async (id) => {
    try {
      await api.put(`/profile/notifications/${id}/read`);
      refresh(); // Syncs immediately without page reload
    } catch (err) {
      console.error("Failed to mark read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/profile/notifications/read-all");
      refresh(); // Syncs immediately without page reload
    } catch (err) {
      console.error("Failed to sync all");
    }
  };

useEffect(() => {
  if (notifications.length > 0) {
    const latest = notifications[0];

    // Only toast if it's unread AND arrived in the last 15 seconds
    const isNew = new Date(latest.createdAt) > new Date(Date.now() - 15000);

    if (!latest.isRead && isNew) {
      toast(latest.title, {
        icon: '🔔',
        // This will automatically use the styles you defined in App.jsx
        duration: 4000,
      });
    }
  }
}, [notifications.length]); // Triggers only when a new notification is added to the list

  return (
   <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/95 to-transparent backdrop-blur-md px-4 md:px-10 py-4 md:py-5 flex items-center justify-between text-white transition-all">
        
        {/* Logo Section - Title visibility fixed for all screens */}
        <Link to="/home" className="flex items-center gap-2 text-xl md:text-[25px] heading shrink-0">
          <img src={logo} alt="Logo" className="h-7 md:h-8" />
          {/* Changed xs:block to sm:block or min-width for better support */}
          <h2 className="hidden min-[380px]:block">
            <span className="text-[#FFC509] font-bold">Cine</span>Mood
          </h2>
        </Link>

        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Desktop Links - Kept exactly the same */}
        {!isSearchOpen && (
          <ul className="hidden lg:flex gap-8 xl:gap-10">
            <NavLink to='/home' className={linkStyle}>Home</NavLink>
            <NavLink to='browse' className={linkStyle}>Browse</NavLink>
            <NavLink to='watchlist' className={linkStyle}>Watchlist</NavLink>
            <NavLink to='ai' className={aiLinkStyle}>VibeSearch</NavLink>
          </ul>
        )}

        {/* Action Group */}
        {!isSearchOpen && (
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search Toggle - Now STRICTLY mobile only (lg:hidden) */}
            {!isMenuOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="lg:hidden p-2 text-xl text-neutral-300 hover:text-[#FFC509]"
              >
                <HiOutlineSearch />
              </button>
            )}

            {/* Notification & Profile - Spacing tightened for mobile */}
            <div className="flex items-center gap-1.5 md:gap-4">
              {user && (
                <NotificationTrigger 
                  unreadCount={unreadCount} 
                  onClick={() => setIsDrawerOpen(true)} 
                />
              )}
              <DropDownProfile />
            </div>

            {/* Mobile Menu Toggle - z-index ensures it stays above the overlay */}
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-2xl md:text-3xl z-50 hover:text-[#FFC509] transition-colors"
            >
              {isMenuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
            </button>
          </div>
        )}
      </nav>

      <div className={`fixed inset-0 z-[55] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        
        {/* Dark Glass Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setIsMenuOpen(false)} />

        {/* Content Container */}
        <div className={`relative h-full flex flex-col items-center justify-center gap-12 transition-all duration-500 delay-100
          ${isMenuOpen ? "translate-y-0 scale-100" : "translate-y-10 scale-95"}`}>
          
          <div className="flex flex-col items-center gap-8 w-full">
            {[
              { to: '/home', label: 'Home' },
              { to: 'browse', label: 'Browse' },
              { to: 'watchlist', label: 'Watchlist' }
            ].map((link, i) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                onClick={() => setIsMenuOpen(false)}
                style={{ transitionDelay: `${i * 50}ms` }}
                className={({isActive}) => `text-3xl font-bold tracking-wide transition-all duration-300 ${
                  isActive ? "text-[#FFC509] scale-110" : "text-white/40 hover:text-white"
                } ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* AI VibeSearch Button with Pulsing Glow */}
          <NavLink 
            to='ai' 
            onClick={() => setIsMenuOpen(false)} 
            className={`relative group px-10 py-5 rounded-3xl bg-black border border-[#FFC509]/30 transition-all duration-500
              ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Animated Glow Backing */}
            <div className="absolute inset-0 bg-[#FFC509]/20 blur-2xl rounded-full animate-pulse group-hover:bg-[#FFC509]/40 transition-colors" />
            
            <span className="relative z-10 text-2xl font-black italic text-[#FFC509] flex items-center gap-3">
              VibeSearch <span className="animate-pulse"><Sparkle/></span>
            </span>
          </NavLink>

          {/* Subtle footer info for mobile menu */}
          <div className={`absolute bottom-10 text-neutral-600 text-[10px] font-bold uppercase tracking-[0.3em] transition-opacity duration-1000 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
            CineMood AI Engine v3.0
          </div>
        </div>
      </div>

      {/* Notification Drawer - Kept exactly the same */}
      <NotificationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        notifications={notifications}
        onMarkRead={handleMarkRead} 
        onMarkAllRead={handleMarkAllRead}
        onRefresh={refresh}
        loading={loading}
      />
    </>
  )
}

export default Navbar

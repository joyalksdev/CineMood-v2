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
        
        <Link to="/home" className="flex items-center gap-2 text-xl md:text-[25px] heading shrink-0">
          <img src={logo} alt="Logo" className="h-7 md:h-8" />

          <h2 className="hidden min-[380px]:block">
            <span className="text-[#FFC509] font-bold">Cine</span>Mood
          </h2>
        </Link>

        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {!isSearchOpen && (
          <ul className="hidden lg:flex gap-8 xl:gap-10">
            <NavLink to='/home' className={linkStyle}>Home</NavLink>
            <NavLink to='browse' className={linkStyle}>Browse</NavLink>
            <NavLink to='watchlist' className={linkStyle}>Watchlist</NavLink>
            <NavLink to='ai' className={aiLinkStyle}>VibeSearch</NavLink>
          </ul>
        )}

       
        {!isSearchOpen && (
          <div className="flex items-center gap-2 md:gap-4">
            
            
            {!isMenuOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="lg:hidden p-2 text-xl text-neutral-300 hover:text-[#FFC509]"
              >
                <HiOutlineSearch />
              </button>
            )}

          
            <div className="flex items-center gap-1.5 md:gap-4">
              {user && (
                <NotificationTrigger 
                  unreadCount={unreadCount} 
                  onClick={() => setIsDrawerOpen(true)} 
                />
              )}
              <DropDownProfile />
            </div>

           
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-2xl md:text-3xl z-50 hover:text-[#FFC509] transition-colors"
            >
              {isMenuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
            </button>
          </div>
        )}
      </nav>

      <div className={`fixed inset-0 z-[60] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        
     
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={() => setIsMenuOpen(false)} />

   
        <button 
          onClick={() => setIsMenuOpen(false)}
          className={`absolute top-6 right-6 z-[70] p-3 rounded-full bg-white/5 border border-white/10 text-white transition-all duration-500 hover:bg-white/10 hover:rotate-90
            ${isMenuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        >
          <HiX size={24} />
        </button>

      
        <div className={`relative h-full flex flex-col items-center justify-center gap-16 transition-all duration-500
          ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
          
         
          <div className="flex flex-col items-center gap-10 w-full">
            {[
              { to: '/home', label: 'Home' },
              { to: 'browse', label: 'Browse' },
              { to: 'watchlist', label: 'Watchlist' }
            ].map((link, i) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                onClick={() => setIsMenuOpen(false)}
                className={({isActive}) => `text-3xl font-bold tracking-tighter transition-all duration-300 ${
                  isActive ? "text-[#FFC509] scale-110" : "text-white/30 hover:text-white"
                }`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

       
          <NavLink 
            to='ai' 
            onClick={() => setIsMenuOpen(false)} 
            className="relative group p-[2px] rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95"
          >
            
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-[#FFC509] to-orange-600 rounded-2xl blur-md opacity-50 group-hover:opacity-100 animate-pulse" />
            
            <div className="relative px-12 py-5 rounded-2xl bg-black flex items-center gap-4 border border-white/10">
              <div className="relative">
                <Sparkle className="text-[#FFC509] animate-bounce" size={24} />
                <div className="absolute inset-0 bg-[#FFC509] blur-lg opacity-40 animate-pulse" />
              </div>
              
              <span className="text-2xl font-black italic tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                VibeSearch
              </span>
            </div>
          </NavLink>

       
          <div className="absolute bottom-10 text-neutral-700 text-[10px] font-black uppercase tracking-[0.5em]">
            CineMood System v2.0.4
          </div>
        </div>
      </div>

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

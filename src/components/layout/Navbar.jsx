import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'
import { HiOutlineSearch, HiOutlineMenuAlt3, HiX } from "react-icons/hi"
import DropDownProfile from '../ui/DropDownProfile'
import { useUser } from '../../context/UserContext'
import SearchBar from '../search/SearchBar'
import { Bell } from "lucide-react";
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
      <nav className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-black/90 to-transparent backdrop-blur-md px-10 py-5 flex items-center justify-between text-white">

        <Link to="/home" className="flex items-center gap-3 text-[25px] heading">
          <img src={logo} alt="Logo" className="h-8" />
          <h2><span className="text-[#FFC509] font-bold">Cine</span>Mood</h2>
        </Link>

        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

     
        {!isSearchOpen && (
          <ul className="hidden lg:flex gap-10">
            <NavLink to='/home' className={linkStyle} >Home</NavLink>
            <NavLink to='browse' className={linkStyle} >Browse</NavLink>
            <NavLink to='watchlist' className={linkStyle} >Watchlist</NavLink>
            <NavLink to='ai' className={aiLinkStyle}>VibeSearch</NavLink>
          </ul>
        )}

      
        {!isSearchOpen && (
          <div className="flex items-center gap-4">

    
            <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-2xl">
              <HiOutlineSearch />
            </button>

           <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="lg:hidden text-3xl transition-transform ease-in duration-500"
            >
            {isMenuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
            </button>

            {user && (
              <NotificationTrigger 
                unreadCount={unreadCount} 
                onClick={() => setIsDrawerOpen(true)} 
              />
            )}

            <DropDownProfile />
          </div>
        )}
      </nav>

      <NotificationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        notifications={notifications}
        onMarkRead={handleMarkRead} 
        onMarkAllRead={handleMarkAllRead}
        onRefresh={refresh} // Pass the refresh function
        loading={loading}   // Pass loading state for the spin animation
      />
            


      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 text-xl transition-all duration-300
        ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>

            <NavLink to='/home' onClick={() => setIsMenuOpen(false)} className={linkStyle} >Home</NavLink>
            <NavLink to='browse' onClick={() => setIsMenuOpen(false)} className={linkStyle} >Browse</NavLink>
            <NavLink to='watchlist' onClick={() => setIsMenuOpen(false)} className={linkStyle} >Watchlist</NavLink>
            <NavLink to='ai' onClick={() => setIsMenuOpen(false)} className={aiLinkStyle}>VibeSearch ✨</NavLink>

      </div>
    </>
  )
}

export default Navbar

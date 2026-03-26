import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { 
  User, 
  Bookmark, 
  LogOut, 
  LayoutDashboard, 
  Settings 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DropDownProfile = () => {
  const { user, logout } = useUser()
  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const itemStyle = "flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-200"

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <div className="relative group cursor-pointer" onClick={() => setOpenDropdown(!openDropdown)}>
        <div className={`absolute -inset-0.5 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500 ${user?.role === 'admin' ? 'bg-red-500' : 'bg-[#FFC509]'}`} />
        <img
          src={user?.avatar && user.avatar !== "" 
            ? user.avatar 
            : `https://api.dicebear.com/7.x/micah/svg?seed=${user?.username || 'default'}`
          }
          alt="profile"
          className="relative w-9 h-9 rounded-full border border-white/10 object-cover"
        />
      </div>

      <AnimatePresence>
        {openDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-48 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
          >
            {/* Header / User Info */}
            <div className="px-4 py-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Signed in as</p>
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
            </div>

            <div className="py-2">
              {/* Admin Section */}
              {user?.role === 'admin' && (
                <div className="mb-2 pb-2 border-b border-white/5">
                  <NavLink
                    to="/admin"
                    onClick={() => setOpenDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-green-400 hover:bg-green-500/10 transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </NavLink>
                </div>
              )}

              <NavLink to="/profile" onClick={() => setOpenDropdown(false)} className={itemStyle}>
                <User size={16} />
                Account Settings
              </NavLink>

              <NavLink to="/watchlist" onClick={() => setOpenDropdown(false)} className={itemStyle}>
                <Bookmark size={16} />
                My Watchlist
              </NavLink>
            </div>

            {/* Logout Footer */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-4 text-xs font-bold text-red-500 bg-red-500/[0.03] hover:bg-red-500/10 border-t border-white/5 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DropDownProfile
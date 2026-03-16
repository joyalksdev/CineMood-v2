import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

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

  return (
    <div className="relative" ref={dropdownRef}>
      
     <img
        // If avatar is empty, use DiceBear as a fallback automatically
        src={user?.avatar && user.avatar !== "" 
          ? user.avatar 
          : `https://api.dicebear.com/7.x/micah/svg?seed=${user?.username || 'default'}`
        }
        alt="profile"
        onClick={() => setOpenDropdown(!openDropdown)}
        className="w-9 h-9 rounded-full cursor-pointer border border-neutral-700"
      />


      
      {openDropdown && (
        <div className="absolute right-0 mt-3 w-36 bg-neutral-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <h2 className="text-center py-2 px-5 text-sm font-semibold">
            {user.name}
          </h2>

          <NavLink
            to="/watchlist"
            className="block px-4 py-2 text-sm hover:bg-neutral-800"
          >
            My Watchlist
          </NavLink>

          <NavLink
            to="/profile"
            className="block px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Profile
          </NavLink>

          <button
            onClick={logout}
            className="w-full text-left text-red-400 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}

export default DropDownProfile

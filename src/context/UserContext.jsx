import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // UPDATED: Check both localStorage (permanent) and sessionStorage (temporary)
    const saved = localStorage.getItem("cinemood_user") || sessionStorage.getItem("cinemood_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

 // UserContext.jsx
useEffect(() => {
  const syncUser = async () => {
    try {
      const response = await api.get("/profile/me");
      
      if (response.data.success) {
        // Check if the user was originally in localStorage
        const wasRemembered = localStorage.getItem("cinemood_user") !== null;
        saveUser(response.data.user, wasRemembered);
      }
    } catch (err) {
      localStorage.removeItem("cinemood_user");
      sessionStorage.removeItem("cinemood_user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  syncUser();
}, []);

  const handleClearUser = () => {
    localStorage.removeItem("cinemood_user");
    setUser(null);
  };

const saveUser = (data, remember = false) => {
    if (!data) return;
    setUser(data);
    
    if (remember) {
      // Stays even after browser close
      localStorage.setItem("cinemood_user", JSON.stringify(data));
    } else {
      // Clears when tab is closed
      sessionStorage.setItem("cinemood_user", JSON.stringify(data));
    }
  };
const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // UPDATED: Clear both just to be absolutely safe
      localStorage.removeItem("cinemood_user");
      sessionStorage.removeItem("cinemood_user");
      setUser(null);
      window.location.href = "/login"; 
    }
  };

  return (
    <UserContext.Provider value={{ user, saveUser, logout, loading }}>
      {children} 
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
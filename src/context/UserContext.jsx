import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage so we have an immediate guess
    const saved = localStorage.getItem("cinemood_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

 // UserContext.jsx
useEffect(() => {
  const syncUser = async () => {
    try {
      // Use a custom flag or just a try/catch to avoid the interceptor's alert if possible
      const response = await api.get("/profile/me");
      
      if (response.data.success) {
        saveUser(response.data.user);
      }
    } catch (err) {
      // 401 means no session. This is normal for logged-out users.
      // We just clear the local state and stop loading.
      localStorage.removeItem("cinemood_user");
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

  const saveUser = (data) => {
    if (!data) return;
    setUser(data);
    localStorage.setItem("cinemood_user", JSON.stringify(data));
  };

const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // 1. Clear everything locally
      localStorage.removeItem("cinemood_user");
      setUser(null);
      
      // 2. DO NOT use window.location.href. 
      // App.jsx will see user is null and automatically show <Landing />
    }
  };

  return (
    <UserContext.Provider value={{ user, saveUser, logout, loading }}>
      {children} 
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
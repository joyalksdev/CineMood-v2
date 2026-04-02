import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/axios";

// Create the context for other components to access user data
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state: check localStorage first, then sessionStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cinemood_user") || sessionStorage.getItem("cinemood_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(true);

  // Sync session with the backend on every hard refresh
  useEffect(() => {
    const syncUser = async () => {
      try {
        const response = await api.get("/profile/me");
        
        if (response.data.success) {
          // If they are in localStorage, they chose "Remember Me"
          const wasRemembered = localStorage.getItem("cinemood_user") !== null;
          saveUser(response.data.user, wasRemembered);
        }
      } catch (err) {
        // If the token is expired/invalid, clear everything
        localStorage.removeItem("cinemood_user");
        sessionStorage.removeItem("cinemood_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, []);

  // Update both the state and the browser storage
  const saveUser = (data, remember = false) => {
    if (!data) return;
    setUser(data);
    
    if (remember) {
      // Permanent storage (survives closing the browser)
      localStorage.setItem("cinemood_user", JSON.stringify(data));
    } else {
      // Temporary storage (clears when the tab is closed)
      sessionStorage.setItem("cinemood_user", JSON.stringify(data));
    }
  };

  // Full logout: notifies backend, wipes storage, and redirects
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
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

// Custom hook for easy access: const { user } = useUser();
export const useUser = () => useContext(UserContext);
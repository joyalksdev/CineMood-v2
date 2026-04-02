import { useState, useEffect, useCallback } from 'react';
import api from '../services/axios'; 
import { useUser } from '../context/UserContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!user) return;
    
    // isSilent prevents the UI from flickering to a loader during auto-sync
    if (!isSilent) setLoading(true);

    try {
      const response = await api.get('/profile/notifications'); 
      
      // Handle different possible backend response structures
      const notifyArray = Array.isArray(response.data) 
        ? response.data 
        : response.data.notifications || response.data.data || [];

      setNotifications(notifyArray);
      
      // Calculate how many notifications haven't been opened yet
      const unread = notifyArray.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("neural link sync error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Setup the polling interval when the user logs in
  useEffect(() => {
    if (user) {
      // First load (shows the loading spinner)
      fetchNotifications(); 
      
      // Silent auto-refresh every 15 seconds to keep counts accurate
      const interval = setInterval(() => fetchNotifications(true), 15000); 
      
      // Cleanup the interval if the component unmounts or user logs out
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  return { 
    notifications, 
    unreadCount, 
    loading, 
    // refresh: triggers a manual update with the loading spinner visible
    refresh: () => fetchNotifications(false) 
  };
};
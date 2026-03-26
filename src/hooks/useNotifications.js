import { useState, useEffect, useCallback } from 'react';
import api from '../services/axios'; 
import { useUser } from '../context/UserContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Use useCallback so this function stays stable
  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!user) return;
    
    // Only show loading spinner on the first fetch, not on auto-refreshes
    if (!isSilent) setLoading(true);

    try {
      const response = await api.get('/profile/notifications'); 
      
      const notifyArray = Array.isArray(response.data) 
        ? response.data 
        : response.data.notifications || response.data.data || [];

      setNotifications(notifyArray);
      
      const unread = notifyArray.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Neural link sync error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications(); // Initial load (shows spinner)
      
      // Auto-refresh every 15 seconds (Silent sync)
      const interval = setInterval(() => fetchNotifications(true), 15000); 
      
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  return { 
    notifications, 
    unreadCount, 
    loading, 
    refresh: () => fetchNotifications(false) // Manual refresh button will show spinner
  };
};
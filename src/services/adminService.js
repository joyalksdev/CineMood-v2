import api from "./axios";

// fetch all users for management
export const getUsers = () => api.get("/admin/users");

// fetch all stats and chart data for the main dashboard
export const getDashboardData = () => api.get("/admin/dashboard-data");

// ban, suspend, or activate a user
export const updateUserStatus = (userId, status) => 
  api.put(`/admin/users/${userId}/status`, { status });

// change user role (admin/user)
export const updateUserRole = (userId, role) => 
  api.put(`/admin/users/${userId}/role`, { role });

// add a warning to user profile
export const warnUser = (userId) => 
  api.put(`/admin/users/${userId}/warn`);

// reset warning count to zero
export const clearWarnings = (userId) => 
  api.put(`/admin/users/${userId}/clear`);

// get all reviews (handles both array and object response)
export const getAllReviews = async () => {
  const { data } = await api.get("/admin/reviews");
  return Array.isArray(data) ? data : data.reviews;
};

// delete a toxic review
export const deleteReview = async (id) => {
  const { data } = await api.delete(`/admin/reviews/${id}`);
  return data;
};

// reset report flags if review is safe
export const dismissReviewFlags = async (id) => {
  const { data } = await api.put(`/reviews/${id}/dismiss`);
  return data;
};

// get recent activity logs for dashboard
export const getDashboardLogs = async () => {
  try {
    const { data } = await api.get('/admin/dashboard-data');
    return data.activities || [];
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch logs";
  }
};

// fetch all sent notifications for the history drawer
export const getNotifications = () => api.get("/admin/notifications");

// send a new global or targeted notification
export const sendNotification = (payload) => 
  api.post("/admin/notifications", payload);

// delete a notification from history
export const deleteNotification = (id) => 
  api.delete(`/admin/notifications/${id}`);

// update a scheduled or existing notification
export const updateNotification = (id, updatedData) => 
  api.put(`/admin/notifications/${id}`, updatedData);
import api from './axios';

// Register User
export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; 
};

// Login User
export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; 
};

// Logout User
export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
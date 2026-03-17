import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});

api.interceptors.request.use(
  (req) => req,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
   
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem('cinemood_user');
    
      console.log("Session info: User is currently a guest or session expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
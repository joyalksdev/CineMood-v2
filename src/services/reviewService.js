import api from './axios';

// Add a new review to the MongoDB backend
export const addReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

// Fetch reviews from our own database
export const getMovieReviews = async (movieId) => {
  const response = await api.get(`/reviews/${movieId}`);
  return response.data;
};
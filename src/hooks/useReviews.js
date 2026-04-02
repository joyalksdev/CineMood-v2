import { useEffect, useState } from "react";
import api from "../services/axios"; 

export const useReviews = (movieId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reviews/${movieId}`);
        
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error("Backend Review Error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [movieId]);

  return { reviews, loading };
};
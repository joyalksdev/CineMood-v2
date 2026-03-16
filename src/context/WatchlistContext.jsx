import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";
import { useUser } from "./UserContext";
import { toast } from "react-hot-toast";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user, saveUser } = useUser();
  const [watchlist, setWatchlist] = useState([]);

  // Sync local state with UserContext whenever user changes
  useEffect(() => {
    if (user?.watchlist) {
      setWatchlist(user.watchlist);
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const addToWatchlist = async (movie) => {
    try {
      // We send the whole movie object to MongoDB
      const response = await api.post("/watchlist/add", { movie });
      
      // Backend returns the updated array: res.status(200).json(user.watchlist)
      const updatedWatchlist = response.data;
      
      setWatchlist(updatedWatchlist);
      
      // CRITICAL: Update UserContext so LocalStorage and Header counts stay accurate
      saveUser({ ...user, watchlist: updatedWatchlist });
      
      toast.success(`${movie.title} added!`);
    } catch (err) {
      console.error("Add error:", err);
      toast.error("Failed to add to watchlist");
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await api.delete(`/watchlist/${movieId}`);
      
      const updatedWatchlist = response.data;
      
      setWatchlist(updatedWatchlist);
      
      // CRITICAL: Update UserContext
      saveUser({ ...user, watchlist: updatedWatchlist });
      
      toast.success("Removed from watchlist");
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove");
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
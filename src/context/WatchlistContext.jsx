import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";
import { useUser } from "./UserContext";
import { toast } from "react-hot-toast";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user, saveUser } = useUser();
  const [watchlist, setWatchlist] = useState([]);

  // sync local state with UserContext whenever the logged-in user changes
  useEffect(() => {
    if (user?.watchlist) {
      setWatchlist(user.watchlist);
    } else {
      setWatchlist([]);
    }
  }, [user]);

  // add movie to database and update global user state
  const addToWatchlist = async (movie) => {
    try {
      // POST the movie object to your MongoDB backend
      const response = await api.post("/watchlist/add", { movie });
      
      // we assume backend returns the full updated watchlist array
      const updatedWatchlist = response.data;
      
      setWatchlist(updatedWatchlist);
      
      // update UserContext to keep LocalStorage and Header counts in sync
      saveUser({ ...user, watchlist: updatedWatchlist }, !!localStorage.getItem("cinemood_user"));
      
      toast.success(`${movie.title.toLowerCase()} added!`, {
        style: { background: '#171717', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
      });
    } catch (err) {
      console.error("add error:", err);
      toast.error("failed to add to watchlist");
    }
  };

  // remove movie by ID and sync the remaining list
  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await api.delete(`/watchlist/${movieId}`);
      const updatedWatchlist = response.data;
      
      setWatchlist(updatedWatchlist);
      
      // update UserContext so the change persists across refreshes
      saveUser({ ...user, watchlist: updatedWatchlist }, !!localStorage.getItem("cinemood_user"));
      
      toast.success("removed from watchlist");
    } catch (err) {
      console.error("remove error:", err);
      toast.error("failed to remove");
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
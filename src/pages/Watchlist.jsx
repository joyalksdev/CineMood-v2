import React, { useState } from "react";
import { useWatchlist } from "../context/WatchlistContext";
import QuickViewModal from "../components/modals/QuickViewModal";
import FadeLoader from "react-spinners/FadeLoader";
import GoBackBtn from "../components/ui/GoBackBtn";
import { LucideTrash } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, loading } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hoveredId, setHoveredId] = useState(null); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-transparent">
        <FadeLoader color="#FFC509" radius={-5} speedMultiplier={1} width={4} />
      </div>
    );
  }

  return (
    <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Page Content */}
    <div className="px-8 pb-6 min-h-screen bg-transparent text-white">
      <GoBackBtn />
      
      <header className="mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
          ⭐ Your Watchlist 
          <span className="text-lg font-medium px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
            {watchlist.length}
          </span>
        </h2>
        <p className="text-neutral-400 mt-2">Movies you're planning to watch.</p>
      </header>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl">
          <p className="text-neutral-400 text-xl font-medium">Your list is looking a bit lonely...</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 px-6 py-3 bg-[#FFC509] text-black rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-yellow-400/20"
          >
            Discover Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <AnimatePresence mode="popLayout"> {/* Added for smoother removals */}
            {watchlist.map((movie) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={movie.id} 
                className="group relative"
              >
                <AnimatePresence>
                  {hoveredId === movie.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none"
                    >
                      REMOVE FROM LIST
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div 
                  className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-white/5 border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-[#FFC509]/50 group-hover:shadow-[#FFC509]/10 cursor-pointer"
                  onClick={() => setSelectedMovie(movie)} // Moved onClick here to ensure it catches the click
                >
                  <img
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                      : "https://via.placeholder.com/500x750?text=No+Poster"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={movie.title}
                  />
                  
                  {/* Delete Button Container */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onMouseEnter={() => setHoveredId(movie.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => {
                        e.stopPropagation(); // CRITICAL: Stops the modal from opening when clicking remove
                        removeFromWatchlist(movie.id);
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs hover:bg-red-600 transition-colors shadow-lg shadow-red-500/40"
                    >
                      <LucideTrash size={14} strokeWidth={3} />
                      REMOVE
                    </button>
                  </div>
                </div>
                
                <h3 className="mt-4 text-sm font-bold truncate group-hover:text-[#FFC509] transition-colors">
                  {movie.title}
                </h3>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal - Wrapped in AnimatePresence for smooth entry/exit */}
      <AnimatePresence>
        {selectedMovie && (
          <QuickViewModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>
      
    </div>
    </motion.div>
  );
};

export default Watchlist;
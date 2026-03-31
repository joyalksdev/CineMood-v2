import React, { useState, useEffect, useRef } from "react";
import { useWatchlist } from "../context/WatchlistContext";
import QuickViewModal from "../components/modals/QuickViewModal";
import FadeLoader from "react-spinners/FadeLoader";
import GoBackBtn from "../components/ui/GoBackBtn";
import { LucideTrash, BrainCircuit, Sparkles, Lock, CheckCircle2 } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Meta from "../components/ui/Meta";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import DeleteModal from "../components/modals/DeleteModal";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, loading } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openDeleteModal, setOpenDeleteModal ] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [hoveredId, setHoveredId] = useState(null); 
  const hasNotified = useRef(false); // Ref prevents double-triggering in StrictMode
  const navigate = useNavigate();

  const progress = Math.min((watchlist.length / 5) * 100, 100);
  const isUnlocked = watchlist.length >= 5;

  // Neural Engine One-Time Notification Logic
  // Neural Engine One-Time Notification Logic
useEffect(() => {
  // Check local storage to see if we already notified for this "session" of being at 5+ movies
  const alreadyNotified = localStorage.getItem("neural_engine_notified") === "true";

  if (watchlist.length >= 5 && !alreadyNotified) {
    // Mark as notified in Local Storage immediately
    localStorage.setItem("neural_engine_notified", "true");
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95'} 
        max-w-md w-full bg-[#121212] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto 
        flex border border-[#FFC509]/30 backdrop-blur-xl transition-all duration-300`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <BrainCircuit className="h-10 w-10 text-[#FFC509] animate-pulse" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-black text-white uppercase tracking-widest italic">Neural Engine Online</p>
              <p className="mt-1 text-[11px] text-white/60 leading-relaxed font-medium">
                Threshold reached. Your unique <span className="text-[#FFC509]">Weekly Spotlight</span> has been synthesized based on your taste.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-white/10">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/home', { state: { scrollToSpotlight: true } });
            }}
            className="w-full px-6 flex items-center justify-center text-[10px] font-black tracking-tighter text-[#FFC509] hover:bg-[#FFC509]/5 transition-colors uppercase italic"
          >
            View
          </button>
        </div>
      </div>
    ), { id: 'neural-engine-trigger', duration: 6000 });
  } 
  
  // If they drop below 5, reset the flag so they get the "hype" again when they hit 5 next time
  if (watchlist.length < 5 && alreadyNotified) {
    localStorage.setItem("neural_engine_notified", "false");
  }
}, [watchlist.length, navigate]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-transparent">
        <FadeLoader color="#FFC509" radius={-5} speedMultiplier={1} width={4} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <Meta title="Watchlist" />
      <div className="px-8 pb-6 min-h-screen bg-transparent text-white">
        <GoBackBtn />
        
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
              ⭐ Your Watchlist 
              <span className="text-lg font-medium px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                {watchlist.length}
              </span>
            </h2>
            <p className="text-neutral-400 mt-2">Movies you're planning to watch.</p>
          </div>

          {/* Neural Progress Card */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md w-full md:w-80">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit size={16} className={isUnlocked ? "text-[#FFC509]" : "text-white/40"} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Neural Engine</span>
              </div>
              <span className="text-[10px] font-bold text-[#FFC509]">{watchlist.length}/5 Movies</span>
            </div>
            
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                className="h-full bg-[#FFC509] shadow-[0_0_10px_#FFC509]"
              />
            </div>

            <p className="text-[9px] text-white/40 font-medium uppercase tracking-tighter">
              {isUnlocked ? "✨ Spotlight Synthesized" : `Add ${5 - watchlist.length} more to unlock Weekly Spotlight`}
            </p>

            {isUnlocked && (
              <button onClick={()=> navigate('/home', { state: { scrollToSpotlight: true } })}
            className="text-[10px] font-bold text-green-400 hover:text-[#FFC509] uppercase duration-300 cursor-pointer"
            > View Spotlight</button>
            )}
            
          </div>
        </header>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl">
            <p className="text-neutral-400 text-xl font-medium">Your list is looking a bit lonely...</p>
            <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 bg-[#FFC509] text-black rounded-xl font-bold hover:scale-105 transition-all">
              Discover Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <AnimatePresence mode="popLayout">
              {watchlist.map((movie) => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={movie.id} className="group relative">
                  <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-white/5 border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-[#FFC509]/50 cursor-pointer" onClick={() => setSelectedMovie(movie)}>
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={movie.title} />
                    <button
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setMovieToDelete(movie); 
                            setOpenDeleteModal(true); 
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-2 bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs">
                        <LucideTrash size={14} /> REMOVE
                      </button>
                    <div className="absolute hidden md:block inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setMovieToDelete(movie); 
                            setOpenDeleteModal(true); 
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs"
                      >
                        <LucideTrash size={14} /> REMOVE
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm font-bold truncate group-hover:text-[#FFC509] transition-colors">{movie.title}</h3>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {selectedMovie && <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
        </AnimatePresence>
      </div>
      <ScrollToTopButton />
      <DeleteModal
        isOpen={openDeleteModal}
        onCancel={() => {
          setOpenDeleteModal(false);
          setMovieToDelete(null); // Clear selection on cancel
        }}
        onConfirm={() => {
          removeFromWatchlist(movieToDelete.id); // Use the ID from state
          setOpenDeleteModal(false);
          setMovieToDelete(null);
          toast.success("Removed from watchlist");
        }}
        title="Remove Movie?"
        message={`Are you sure you want to remove "${movieToDelete?.title}" from your Watchlist?`}
        confirmText="Delete Movie"
      />
    </motion.div>
  );
};

export default Watchlist;
import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Loader2,
  History,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/axios";
import QuickViewModal from "../modals/QuickViewModal";
import InfoTooltip from "../ui/InfoTooltip";
import { useWatchlist } from "../../context/WatchlistContext";
import { motion, AnimatePresence } from "framer-motion";

const WeeklySpotlight = () => {
  const [evolutionData, setEvolutionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { watchlist } = useWatchlist();
  const progress = Math.min(((watchlist?.length || 0) / 5) * 100, 100);

  useEffect(() => {
    // 1. Only run if we aren't loading anymore
    // 2. Check if the "scrollToSpotlight" flag exists in location.state
    // 3. Ensure the ref is actually attached to the DOM
    if (!isLoading && location.state?.scrollToSpotlight && sectionRef.current) {
      
      // We use a tiny timeout to ensure the browser has finished painting the new layout
      const timer = setTimeout(() => {
        sectionRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });

        // Clear the state so it doesn't scroll again if the user refreshes
        navigate(location.pathname, { replace: true, state: {} });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading, location.state, navigate]);
  
  const fetchSpotlight = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/ai/weekly-spotlight");
      setEvolutionData(data.success && data.movies?.length > 0 ? data : { empty: true });
    } catch (err) {
      setEvolutionData({ empty: true });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSpotlight();
  }, []);


  const scroll = (direction) => {
    if (scrollRef.current) {
      const amt = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ 
        left: direction === "left" ? -amt : amt, 
        behavior: "smooth" 
      });
    }
  };

  if (isLoading) return (
    <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#FFC509] mb-4" size={32} />
      <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-black">Neural Sync in Progress</p>
    </div>
  );

 if (evolutionData?.empty)
  return (
    <section
      id="spotlight-section"
      ref={sectionRef}
      className="w-full max-w-5xl mx-auto px-4 mb-10" // Reduced max-width and margin
    >
      <div className="relative bg-neutral-900/40 rounded-[2rem] border border-white/5 p-6 md:p-12 overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Background Decorative Element - Scaled down */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#FFC509]/5 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Header Label - Tighter */}
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 mb-4">
            <Sparkles className="text-green-400" size={8} />
            <span className="text-green-400 text-[8px] font-black uppercase tracking-[0.2em]">
              AI Neural Engine v2.5
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic leading-none mb-4">
            Weekly <span className="text-[#FFC509]">Spotlight</span>
          </h2>

          <p className="text-white/50 text-xs md:text-sm font-medium leading-relaxed mb-8">
            The <span className="text-white">Weekly Spotlight</span> is a
            personalized cinematic evolution. To calibrate your profile, we 
            need more fuel for the engine.
          </p>

          {/* Progress System - More Compact */}
          <div className="w-full bg-black/40 p-6 rounded-[1.5rem] border border-white/5 mb-8">
            <div className="flex justify-between items-end mb-3">
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFC509]">
                  Calibration
                </p>
                <h4 className="text-white text-base font-bold italic">
                  Engine Progress
                </h4>
              </div>
              <span className="text-xl font-black italic text-white tracking-tighter">
                {watchlist?.length || 0}
                <span className="text-white/20">/</span>5
              </span>
            </div>

            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#FFC509] rounded-full shadow-[0_0_15px_#FFC509] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>

            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-4">
              Add {Math.max(5 - (watchlist?.length || 0), 0)} more movies to your watchlist to ignite the engine."
            </p>
          </div>

          <button
            onClick={() => navigate("/browse")}
            className="group flex items-center gap-3 px-8 py-4 bg-[#FFC509] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            Find Your Fuel{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 mb-20 animate-in fade-in duration-1000">
      <div className="relative bg-[#0A0A0A] rounded-[3rem] border border-white/5 p-6 md:p-14 shadow-2xl overflow-hidden">
        
        {/* Aesthetic Background Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC509]/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

        <header className="relative z-10 mb-12">
          {/* Top Label Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-400/[0.03] border border-green-400/10">
                <Sparkles className="text-green-400" size={10} />
                <span className="text-green-400 text-[9px] font-black uppercase tracking-[0.2em]">Neural Engine v2.5</span>
              </div>
              <InfoTooltip title="Neural Evolution" content="A theme synthesized weekly from your unique viewing habits." />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
                <button onClick={() => scroll("left")} className="p-3 rounded-full bg-white/5 text-white/40 hover:bg-[#FFC509] hover:text-black transition-all"><ChevronLeft size={18}/></button>
                <button onClick={() => scroll("right")} className="p-3 rounded-full bg-white/5 text-white/40 hover:bg-[#FFC509] hover:text-black transition-all"><ChevronRight size={18}/></button>
                <button onClick={fetchSpotlight} className="p-3 text-white/20 hover:text-[#FFC509] transition-colors"><History size={18}/></button>
            </div>
          </div>

          {/* Main Heading & AI Insight Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg md:text-xl font-bold italic text-white/40 uppercase tracking-tighter">Weekly Spotlight</h3>
              <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] uppercase italic">
                {evolutionData.themeTitle}
              </h2>
              <p className="text-white/50 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                {evolutionData.themeDescription}
              </p>
            </div>

            {/* AI Insight Box - Now sits to the side on Desktop */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                {evolutionData.aiInsight && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full flex items-start gap-4 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 backdrop-blur-md"
                  >
                    <BrainCircuit className="text-[#FFC509] shrink-0" size={20} />
                    <div className="space-y-2">
                      <span className="text-[#FFC509] font-black uppercase text-[10px] tracking-widest block">AI Neural Analysis</span>
                      <p className="text-sm font-medium text-white/60 leading-relaxed italic">
                        "{evolutionData.aiInsight}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-8 pb-6 scrollbar-hide snap-x touch-pan-x"
        >
          {evolutionData.movies.map((movie, index) => (
            <div
              key={movie.id || index}
              onClick={() => setSelectedMovie(movie)}
              className="flex-none w-[160px] sm:w-[170px] md:w-[200px] snap-start group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-[#FFC509]/40 transition-all duration-500 shadow-2xl bg-neutral-900">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Minimal Label on card */}
                <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <p className="text-white text-sm font-bold italic leading-none">{movie.title}</p>
                </div>
              </div>
              
              {/* Mobile Info (Visible without hover) */}
              <div className="mt-4 md:hidden px-2">
                <p className="text-white text-xs font-bold truncate lowercase italic">{movie.title}</p>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">
                  {movie.release_date?.split("-")[0]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-Only Navigation Buttons */}
        <div className="flex md:hidden items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5">
            <button onClick={() => scroll("left")} className="text-white/20 hover:text-[#FFC509] transition-colors"><ChevronLeft size={24}/></button>
            <button onClick={fetchSpotlight} className="text-white/10 hover:text-[#FFC509] transition-colors"><History size={20}/></button>
            <button onClick={() => scroll("right")} className="text-white/20 hover:text-[#FFC509] transition-colors"><ChevronRight size={24}/></button>
        </div>
      </div>

      {selectedMovie && (
        <QuickViewModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </section>
  );
};

export default WeeklySpotlight;
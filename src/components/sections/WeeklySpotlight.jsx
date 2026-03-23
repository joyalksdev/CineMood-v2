import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, History, ChevronLeft, ChevronRight, Play, BrainCircuit } from 'lucide-react';
import api from '../../services/axios';
import QuickViewModal from '../modals/QuickViewModal'; 
import InfoTooltip from '../ui/InfoTooltip';

const WeeklySpotlight = () => {
  const [evolutionData, setEvolutionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchSpotlight();
  }, []);

  const fetchSpotlight = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/ai/weekly-spotlight');
      if (data.success) {
        setEvolutionData(data);
      }
    } catch (err) {
      console.error("Spotlight Sync Failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) return (
    <div className="max-w-7xl mx-auto p-12 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
      <div className="relative">
        <Loader2 className="animate-spin text-[#FFC509]" size={40} />
        <Sparkles className="absolute -top-1 -right-1 text-[#FFC509] animate-pulse" size={16} />
      </div>
      <p className="text-white/40 mt-6 animate-pulse text-[10px] tracking-[0.3em] uppercase font-bold text-center">
        Consulting the Neural Engine...
      </p>
    </div>
  );

  if (!evolutionData || evolutionData.movies?.length === 0) return null;

  return (
    <div className="max-w-lg md:max-w-7xl mx-auto px-4 mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* OVERFLOW FIX: Remove overflow-hidden from here so Tooltip works. 
          Added relative and z-10 to keep content above the background layer.
      */}
      <div className="relative bg-gradient-to-br from-neutral-900/90 to-black/60 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-6 md:p-14 shadow-2xl">
        
        {/* Background Glow Layer (Handles the clipping of glows) */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] pointer-events-none z-0">
          <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-64 h-64 md:w-96 md:h-96 bg-[#FFC509]/5 rounded-full blur-[80px] md:blur-[120px]" />
        </div>
        
        <div className="relative z-10">
          <header className="mb-8 md:mb-12 flex flex-col gap-6">
            <div className="space-y-4">
              
              {/* Badge & Label Row */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC509]/10 border border-[#FFC509]/20">
                    <Sparkles className="text-[#FFC509]" size={12} />
                    <span className="text-[#FFC509] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Neural Intelligence v2.5</span>
                  </div>
                  
                  <InfoTooltip 
                    title="Neural Analysis"
                    content="Our AI interprets your recent watchlist activity to discover hidden thematic patterns, ensuring your spotlight is unique to your current cinematic mood."
                  />
                </div>

                {/* Refined "Weekly Spotlight" Label */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-white/10 hidden md:block"></span>
                  <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.3em]">
                    Weekly Spotlight
                  </span>
                </div>
              </div>
              
              {/* Responsive Dynamic Title */}
              <h2 className="text-3xl max-w-105 md:max-w-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] md:leading-none">
                {evolutionData.themeTitle}
              </h2>
              
              <div className="flex flex-col gap-5">
                  <p className="text-white/60 max-w-sm md:max-w-2xl text-base font-medium leading-relaxed">
                    {evolutionData.themeDescription}
                  </p>
                  
                  {evolutionData.aiInsight && (
                    <div className="flex items-start md:items-center gap-2 text-[#FFC509]/80 bg-[#FFC509]/5 self-start px-3 py-2 md:px-4 md:py-2 rounded-xl border border-[#FFC509]/10 group transition-all hover:bg-[#FFC509]/10">
                        <BrainCircuit size={16} className="shrink-0 mt-0.5 md:mt-0 animate-pulse text-[#FFC509]" />
                        <span className="text-[11px] md:text-xs font-semibold leading-tight">
                          <span className="text-[#FFC509] mr-1 uppercase text-[9px] tracking-wider font-black">AI Insight:</span>
                          {evolutionData.aiInsight}
                        </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-start md:justify-end gap-4 border-t border-white/5 pt-6 md:border-0 md:pt-0">
               <div className="flex gap-2">
                <button 
                  onClick={() => scroll("left")} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFC509] hover:text-black transition-all active:scale-90"
                >
                  <ChevronLeft size={20} md:size={24} />
                </button>
                <button 
                  onClick={() => scroll("right")} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFC509] hover:text-black transition-all active:scale-90"
                >
                  <ChevronRight size={20} md:size={24} />
                </button>
              </div>
              
              <button 
                onClick={() => fetchSpotlight()} 
                className="p-3 rounded-full bg-white/5 text-white/40 hover:text-[#FFC509] transition-colors active:rotate-180 duration-500"
              >
                <History size={18} md:size={20} />
              </button>
            </div>
          </header>

          {/* Movie Slider */}
          <div 
            ref={scrollRef} 
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-8 scrollbar-hide snap-x touch-pan-x"
          >
            {evolutionData.movies.map((movie, index) => (
              <div 
                key={movie.id || index}
                onClick={() => setSelectedMovie(movie)}
                className="flex-none w-[130px] md:w-56 snap-start group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-[#FFC509]/30 transition-all duration-500 shadow-2xl">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={movie.title}
                    loading="lazy"
                  />
                  
                  <div className="absolute hidden inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 md:flex flex-col justify-end p-6">
                    <p className="text-[#FFC509] text-[9px] font-black uppercase tracking-widest mb-1">Recommended</p>
                    <p className="text-white text-sm font-bold leading-tight mb-3 line-clamp-2">{movie.title}</p>
                    <div className="text-[#FFC509] text-xs uppercase font-semibold flex items-center gap-2">
                     View Details <Play size={10} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedMovie && (
        <QuickViewModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default WeeklySpotlight;
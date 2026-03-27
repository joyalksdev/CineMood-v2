import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, History, ChevronLeft, ChevronRight, BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/axios';
import QuickViewModal from '../modals/QuickViewModal'; 
import InfoTooltip from '../ui/InfoTooltip';
import { useWatchlist } from '../../context/WatchlistContext';
import { motion } from 'framer-motion';

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
    fetchSpotlight();
  }, []);

  useEffect(() => {
    if (!isLoading && evolutionData && location.state?.scrollToSpotlight) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [isLoading, evolutionData, location.state]);

  const fetchSpotlight = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/ai/weekly-spotlight');
      if (data.success && data.movies?.length > 0) {
        setEvolutionData(data);
      } else {
        setEvolutionData({ empty: true });
      }
    } catch (err) {
      console.error("Spotlight Sync Failed", err);
      setEvolutionData({ empty: true });
    } finally {
      setIsLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="animate-spin text-[#FFC509]" size={40} />
        <Sparkles className="absolute -top-1 -right-1 text-[#FFC509] animate-pulse" size={16} />
      </div>
      <p className="text-white/40 mt-6 text-[10px] tracking-[0.3em] uppercase font-bold text-center">
        Syncing Neural Data...
      </p>
    </div>
  );

  if (evolutionData?.empty) return (
    <section id="spotlight-section" ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 mb-12">
      <div className="relative bg-neutral-900/50 rounded-[2.5rem] border border-white/5 p-6 md:p-16 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="p-4 bg-[#FFC509]/10 rounded-2xl border border-[#FFC509]/20">
            <BrainCircuit className="text-[#FFC509]" size={32} />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
            The Engine needs <span className="text-[#FFC509]">Fuel.</span>
          </h2>
          
          <div className="w-full bg-black/20 p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="text-white/40">Neural Analysis</span>
              <span className="text-[#FFC509]">{watchlist?.length || 0} / 5</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                className="h-full bg-[#FFC509] shadow-[0_0_15px_#FFC509]"
              />
            </div>
          </div>

          <button 
            onClick={() => navigate('/browse')}
            className="flex items-center gap-3 px-8 py-4 bg-[#FFC509] text-black font-black uppercase text-xs tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95"
          >
            Start Discovering <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative bg-gradient-to-br from-neutral-900 to-black rounded-[2.5rem] border border-white/5 p-6 md:p-12 shadow-2xl">
        
        <header className="relative z-10 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC509]/10 border border-[#FFC509]/20">
                  <Sparkles className="text-[#FFC509]" size={10} />
                  <span className="text-[#FFC509] text-[9px] font-black uppercase tracking-widest">AI Neural Engine v2.0</span>
                </div>
                <InfoTooltip 
                   title="AI Insights" 
                   content="Your Weekly Spotlight is generated by analyzing your personal cinematic DNA." 
                />
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                {evolutionData.themeTitle}
              </h2>
              
              <p className="text-white/50 text-base md:text-lg font-medium max-w-2xl">
                {evolutionData.themeDescription}
              </p>

              {evolutionData.aiInsight && (
                <div className="flex items-start gap-3 bg-[#FFC509]/5 p-4 rounded-xl border border-[#FFC509]/10">
                  <BrainCircuit className="text-[#FFC509] shrink-0 mt-1" size={16} />
                  <p className="text-xs md:text-sm font-medium text-[#FFC509]/90 leading-relaxed italic">
                    {evolutionData.aiInsight}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFC509] hover:text-black transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFC509] hover:text-black transition-all">
                <ChevronRight size={20} />
              </button>
              <button onClick={() => fetchSpotlight()} className="p-4 rounded-full bg-white/5 text-white/40 hover:text-[#FFC509] transition-colors">
                <History size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Improved Responsive Grid/Scroll Container */}
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide snap-x touch-pan-x"
        >
          {evolutionData.movies.map((movie, index) => (
            <div 
              key={movie.id || index} 
              onClick={() => setSelectedMovie(movie)} 
              className="flex-none w-[120px] sm:w-[200px] md:w-[240px] snap-start group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-[#FFC509]/40 transition-all duration-500 shadow-xl bg-neutral-800">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 md:p-6">
                   <p className="text-white text-sm md:text-base font-bold line-clamp-2 leading-tight">
                     {movie.title}
                   </p>
                </div>
              </div>
              <div className="mt-3 md:hidden">
                <p className="text-white text-[11px] font-bold truncate">{movie.title}</p>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-tighter mt-0.5">
                  {movie.release_date?.split('-')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </section>
  );
};

export default WeeklySpotlight;
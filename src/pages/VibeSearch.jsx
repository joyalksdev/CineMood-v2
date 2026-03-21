import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, X, Search, Star, Clapperboard, AlertCircle, HelpCircle, MessageSquare, Cpu, Database, Fingerprint } from 'lucide-react';
import { getAiRecommendations } from "../services/aiService";
import moviePlaceholder from "../assets/m-placeholder.png";

const VibeSearch = ({ onSelectMovie }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [reason, setReason] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycling through "AI Thoughts" during loading
  const loadingSteps = [
    { icon: <Fingerprint size={16} />, text: "Analyzing your vibe..." },
    { icon: <Cpu size={16} />, text: "Consulting Gemini 1.5-flash..." },
    { icon: <Database size={16} />, text: "Cross-referencing TMDB archives..." },
    { icon: <Sparkles size={16} />, text: "Finalizing cinematic matches..." }
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1200);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setReason("");

    try {
      const data = await getAiRecommendations(query, "gemini-1.5-flash", "semantic_search");
      if (data.success) {
        setResults(data.movies);
        setReason(data.reason);
        setSuggestion(data.suggestion);
      } else if (data.status === 429) {
        setError("limit");
      }
    } catch (err) {
      setToast("Connection sluggish. Trying again...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white px-4 md:px-6 pt-12 pb-20 relative">
      
   
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-2 h-2 rounded-full bg-[#FFC509] animate-pulse" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto text-center mb-12">
        
    
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-6 animate-fade-in">
          <Sparkles size={14} className="animate-pulse" />
          CineMood AI Nueral Engine v1.0
        </div>

        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-6xl font-bold bg-gradient-to-r py-5 from-[#FFC509] to-orange-500 bg-clip-text text-transparent tracking-tighter">
            What are we watching?
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed tracking-wide animate-in fade-in duration-1000 delay-300">
            An intelligent lens for your cinematic cravings. Describe a feeling, 
            a setting, or a memory, and let our neural engine handle the rest.
          </p>
        </div>

     
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
          <div className="relative flex items-center bg-neutral-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl focus-within:border-[#FFC509]/40 transition-all shadow-2xl">
            <div className="pl-5 text-white/20 group-focus-within:text-[#FFC509] transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mood, genre, or actor..."
              className="w-full bg-transparent py-4 md:py-5 px-4 text-base focus:outline-none placeholder:text-white/10"
            />
            <div className="flex items-center gap-2 pr-2 py-2 bg-gradient-to-l from-neutral-950 via-neutral-950/90 to-transparent pl-12">
              {query && !isLoading && (
                <button
                  onClick={() => { setQuery(""); setResults([]); setReason(""); setError(null); }}
                  type="button"
                  className="p-2 text-white/20 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#FFC509] text-black h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(255,197,9,0.2)]"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} fill="currentColor" />}
              </button>
            </div>
          </div>
        </form>

        {isLoading && (
          <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-[#FFC509] animate-spin-slow">
                {loadingSteps[loadingStep].icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                {loadingSteps[loadingStep].text}
              </span>
            </div>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#FFC509]/30 to-transparent mt-4" />
          </div>
        )}

        {reason && !isLoading && (
          <div className="mt-8 p-6 bg-white/[0.03] border-l-2 border-[#FFC509]/50 text-left rounded-r-2xl animate-in fade-in slide-in-from-left-4">
             <div className="flex items-center gap-2 mb-2 text-[#FFC509]">
                <MessageSquare size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Neural Insight</span>
             </div>
            <p className="text-white/70 text-sm md:text-base leading-relaxed italic">"{reason}"</p>
          </div>
        )}

        {error === "limit" && (
          <div className="mt-8 p-8 border border-red-500/20 bg-red-500/5 rounded-[2rem] text-center animate-in zoom-in-95 duration-500">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">Daily Vibe Limit Reached</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto mb-6">
              Our AI is currently cooling down. Come back in a few hours for fresh matches.
            </p>
            <button 
              onClick={() => setError(null)}
              className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {results.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-neutral-800 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={movie.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="font-bold text-[13px] leading-tight mb-1">{movie.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">{movie.release_date?.split("-")[0]}</span>
                  <div className="flex items-center gap-1 text-[#FFC509]">
                    <Star size={10} fill="#FFC509" />
                    <span className="text-[10px] font-black">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VibeSearch;
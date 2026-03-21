import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Trophy, History, Film, AlertCircle, Clock } from 'lucide-react';
import { getAiRecommendations } from '../../services/aiService';
import axios from 'axios';

const PersonaMatch = ({ onSelectMovie }) => {
  const [mood, setMood] = useState("");
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // NEW: Cooldown state
  const [cooldown, setCooldown] = useState(0);

  // Timer logic for cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const findMatchByMood = async () => {
    if (!mood.trim() || cooldown > 0) return;
    setIsLoading(true);
    setMatch(null);
    try {
      const response = await getAiRecommendations(mood, "gemini-1.5-flash", "semantic_search");
      if (response.success && response.movies.length > 0) {
        setMatch({ movie: response.movies[0], persona: "Custom Vibe", reason: response.reason });
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setCooldown(30); // Trigger 30s cooldown
      } else {
        alert("AI is busy. Try again soon!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const findMatchByWatchlist = async () => {
    if (isSyncing || cooldown > 0) return;
    setIsSyncing(true);
    setMatch(null);
    try {
      const { data: watchlistData } = await axios.get('https://cinemood-api.onrender.com/api/watchlist/titles', {
        withCredentials: true 
      });

      if (!watchlistData.titles) {
        alert("Add some movies first!");
        return;
      }

      const response = await getAiRecommendations(watchlistData.titles, "gemini-1.5-flash", "persona_recommendation");
      if (response.success && response.movies.length > 0) {
        setMatch({ movie: response.movies[0], persona: response.persona, reason: response.reason });
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setCooldown(60); // Longer cooldown for heavy watchlist tasks
      } else {
        alert("Failed to sync your history.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="bg-indigo-500/10 text-indigo-400 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/20">
            AI Recommendations
          </span>
          <h2 className="text-4xl font-bold text-white mt-4 tracking-tight">
            Discover Your <span className="text-[#FFC509]">Persona</span>
          </h2>
        </div>

        {/* NEW: Cooldown Alert Card */}
        {cooldown > 0 && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
            <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-amber-200 text-sm font-bold">AI Cooling Down</p>
              <p className="text-amber-200/60 text-xs">Too many requests! Buttons will unlock in {cooldown}s</p>
            </div>
          </div>
        )}

        {/* Input Controls */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Film className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FFC509] transition-colors" size={18} />
              <input 
                disabled={cooldown > 0}
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder={cooldown > 0 ? "AI is resting..." : "What's the vibe today?"}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC509]/40 transition-all disabled:opacity-30"
              />
            </div>
            <button 
              onClick={findMatchByMood}
              disabled={isLoading || isSyncing || cooldown > 0}
              className="bg-[#FFC509] hover:bg-[#e6b108] text-black px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:bg-neutral-800 disabled:text-white/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Match Mood
            </button>
          </div>

          <button 
            onClick={findMatchByWatchlist}
            disabled={isLoading || isSyncing || cooldown > 0}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl border border-white/5 transition-all text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-20"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={14} /> : <History size={14} />}
            Sync Watchlist History
          </button>
        </div>

        {/* The Reveal */}
        {match && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-[#FFC509]/5 to-transparent border border-[#FFC509]/20 rounded-2xl p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${match.movie.poster_path}`} 
                  className="w-40 md:w-52 rounded-xl shadow-2xl border border-white/10"
                  alt="Poster"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Not+Found'}
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <Trophy className="text-[#FFC509]" size={16} />
                    <span className="text-[#FFC509] font-bold uppercase text-xs tracking-tighter">
                      {match.persona}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{match.movie.title}</h3>
                  <p className="text-white/50 text-base leading-relaxed italic mb-6">
                    "{match.reason}"
                  </p>
                  <button 
                    onClick={() => onSelectMovie(match.movie)}
                    className="bg-white text-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#FFC509] transition-colors"
                  >
                    View Movie details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaMatch;
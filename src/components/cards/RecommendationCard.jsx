import React, { useEffect, useRef, useState } from "react";
import { fetchPersonalizedMovies } from "../../services/tmbdApi";
import { useUser } from "../../context/UserContext";
import QuickViewModal from "../modals/QuickViewModal";
import { ChevronLeft, ChevronRight, Star, Info, Target } from "lucide-react";
import WatchlistButton from "../ui/WatchlistButton";
import moviePlaceholder from "../../assets/m-placeholder.png";
import CardSkelton from "./CardSkelton";

const RecommendationCard = () => {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      if (!user?.genres?.length) {
        setMovies([]);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchPersonalizedMovies(user.genres, user.language);
        setMovies(data || []);
      } catch (error) {
        console.error("Recommendation fetch failed:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    loadRecommendations();
  }, [user]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 group/section relative overflow-hidden">
      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Header Area */}
      <div className="flex justify-between items-end mb-4 px-4 md:px-12">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight group-hover/section:text-[#FFC509] transition-colors duration-300 flex items-center gap-2">
            <Target size={24} className="text-[#FFC509]" /> Recommended for You
          </h2>
          <div className="h-1 w-12 bg-[#FFC509] rounded-full shadow-[0_0_15px_rgba(255,197,9,0.5)]" />
        </div>
        <p className="hidden md:block text-green-400/90 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
          Based on your Cinemood Profile
        </p>
      </div>

      <div className="relative group/carousel px-4 md:px-10">
        <button onClick={() => scroll("left")} className="absolute left-1 top-[40%] -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-black/80 backdrop-blur-2xl border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all hidden md:flex hover:scale-110 hover:border-[#FFC509]/50 hover:text-[#FFC509]">
          <ChevronLeft size={32} />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-1 top-[40%] -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-black/80 backdrop-blur-2xl border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all hidden md:flex hover:scale-110 hover:border-[#FFC509]/50 hover:text-[#FFC509]">
          <ChevronRight size={32} />
        </button>

        <div ref={rowRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory">
          {loading ? (
            [...Array(8)].map((_, i) => <CardSkelton key={i} />)
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)} // Tap to open on mobile
                className="relative px-3 min-w-[145px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[260px] snap-start group/card py-2 cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all duration-500 md:group-hover/card:border-[#FFC509]/40 shadow-2xl">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                    className="w-full h-full object-cover transition-all duration-700 md:group-hover/card:scale-105 md:group-hover/card:brightness-[0.35] opacity-90"
                    alt={movie.title}
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[#FFC509] flex items-center gap-1 font-black text-[10px] z-10 transition-transform md:group-hover/card:scale-110">
                    <Star size={12} fill="#FFC509" />
                    {(movie.rating || movie.vote_average || 0).toFixed(1)}
                  </div>

                  {/* MOBILE ONLY: Floating Watchlist */}
                  <div className="absolute bottom-3 right-3 md:hidden z-20" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl p-0.5">
                        <WatchlistButton movie={movie} variant="card" />
                    </div>
                  </div>

                  {/* DESKTOP ONLY: Hover Overlay */}
                  <div className="hidden md:flex absolute inset-0 flex-col justify-end p-5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 bg-gradient-to-t from-black via-black/40 to-transparent">
                    <h3 className="text-white font-bold text-sm mb-4 line-clamp-2 leading-tight transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                      {movie.title}
                    </h3>

                    <div className="flex items-center gap-2 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
                      <button 
                        className="flex-1 h-10 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FFC509] transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Info size={16} strokeWidth={3} /> Info
                      </button>
                      
                      <div className="pointer-events-auto h-10 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                        <WatchlistButton movie={movie} variant="card" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-text below Card */}
                <div className="mt-4 px-2">
                  <h4 className="text-white text-[13px] font-bold truncate md:hidden mb-1">{movie.title}</h4>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] group-hover/card:text-[#FFC509] transition-colors duration-300">
                    {movie.release_date?.split("-")[0]} • Personalized
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendationCard;
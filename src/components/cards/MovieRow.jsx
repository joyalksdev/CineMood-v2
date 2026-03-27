import React, { useEffect, useRef, useState } from "react";
import QuickViewModal from "../modals/QuickViewModal";
import { ChevronLeft, ChevronRight, Star, Info, ArrowRight } from "lucide-react";
import WatchlistButton from "../ui/WatchlistButton";
import moviePlaceholder from "../../assets/m-placeholder.png";
import CardSkelton from "./CardSkelton";
import { useNavigate } from "react-router-dom";

const MovieRow = ({ rowId, title, fetchFn }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const rowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchFn().then((data) => {
      if (isMounted) {
        setMovies(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [fetchFn]);

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
    <section className="py-6 group/section relative overflow-hidden">
      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Header Area */}
      <div className="flex justify-between items-end mb-4 px-4 md:px-12">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight group-hover/section:text-[#FFC509] transition-colors duration-300">
            {title}
          </h2>
          <div className="h-1 w-8 bg-green-400 rounded-full" />
        </div>
        <button onClick={() => navigate(`/movies/${rowId}`)} className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-green-400 transition-all">
          Explore <ArrowRight size={14} />
        </button>
      </div>

      <div className="relative group/carousel px-4 md:px-10">
        <button onClick={() => scroll("left")} className="absolute left-1 top-[40%] -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-black/80 backdrop-blur-2xl border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all hidden md:flex hover:scale-110 hover:border-green-400/50 hover:text-green-400">
          <ChevronLeft size={32} />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-1 top-[40%] -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-black/80 backdrop-blur-2xl border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all hidden md:flex hover:scale-110 hover:border-green-400/50 hover:text-green-400">
          <ChevronRight size={32} />
        </button>

        <div ref={rowRef} className={`${loading ? 'gap-3' : 'gap-0'} flex gap-1 md:gap-3 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory`}>
          {loading ? (
            [...Array(8)].map((_, i) => <CardSkelton key={i} />)
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie({ ...movie, isFromTrending: rowId === 'trending' })}
                className="relative px-3 min-w-[135px] sm:min-w-[170px] md:min-w-[200px] lg:min-w-[250px] snap-start group/card py-2 cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all duration-500 group-hover/card:border-green-400/30 shadow-2xl">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                    className="w-full h-full object-cover transition-all duration-700 md:group-hover/card:scale-105 md:group-hover/card:brightness-[0.4] opacity-90"
                    alt={movie.title}
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[#FFC509] flex items-center gap-1 font-bold text-[9px] z-10 transition-transform md:group-hover/card:scale-110">
                    <Star size={10} fill="yellow" />
                    {(movie.rating || movie.vote_average || 0).toFixed(1)}
                  </div>

                  {/* MOBILE ONLY: Watchlist Floating Icon */}
                  <div className="absolute bottom-2 right-2 md:hidden z-20" onClick={(e) => e.stopPropagation()}>
                     <div className="p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg">
                        <WatchlistButton movie={movie} variant="card" />
                     </div>
                  </div>

                  {/* DESKTOP ONLY: Hover Overlay */}
                  <div className="hidden md:flex absolute inset-0 flex-col justify-end p-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                    <h3 className="text-white font-bold text-sm mb-3 line-clamp-2 leading-tight transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
                      <button 
                        className="flex-1 h-10 bg-white text-black text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#FFC509] transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Info size={16} strokeWidth={2.5} /> Info
                      </button>
                      <div className="pointer-events-auto flex items-center justify-center min-w-[40px] h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition-all">
                        <WatchlistButton movie={movie} variant="card" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title & Info - Visible on all devices below card */}
                <div className="mt-3 px-1">
                   <h4 className="text-white text-[12px] font-semibold truncate md:hidden mb-1">{movie.title}</h4>
                  <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest group-hover/card:text-green-400 transition-colors">
                    {movie.release_date?.split("-")[0]} • {movie.media_type || "Movie"}
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

export default MovieRow;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  fetchMovieReviews,
} from "../services/tmbdApi";
import QuickViewModal from "../components/modals/QuickViewModal";
import TrailerModal from "../components/modals/TrailerModal";
import { FadeLoader } from "react-spinners";
import WatchlistButton from "../components/ui/WatchlistButton";
import { IoPlay, IoStar, IoCreateOutline } from "react-icons/io5";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { RiDoubleQuotesL } from "react-icons/ri";
import userPlaceholder from "../assets/user-placeholder.png";
import moviePlaceholder from "../assets/m-placeholder.png";
import MovieCard from "../components/cards/MovieCard";
import { useReviews } from "../services/useReviews";
import ReviewModal from "../components/modals/ReviewModal";
import GoBackBtn from "../components/ui/GoBackBtn";
import { Flag } from "lucide-react";
import ReportModal from "../components/modals/ReportModal";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [movie, setMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [openReview, setOpenReview] = useState(false);
  const [reportingReview, setReportingReview] = useState(null);

  // DB Reviews Hook
  const { reviews } = useReviews(id);

  // LOGIC: Combine reviews and ensure we only take what we need
  const displayReviews = reviews.length > 0 ? reviews.slice(0, 4) : tmdbReviews.slice(0, 4);

  useEffect(() => {
    const load = async () => {
      try {
        const [movieData, tmdb] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieReviews(id, 1)
        ]);
        setMovie(movieData);
        setTmdbReviews(tmdb.results || []);
      } catch (err) {
        console.error("Failed to load movie:", err);
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!movie) return (
    <div className="flex justify-center items-center h-[60vh]">
      <FadeLoader color="#FFC509" />
    </div>
  );

  // Crew filtering logic
  const director = movie.credits?.crew?.find(person => person.job === "Director");
  const writers = movie.credits?.crew
    ?.filter(person => ["Writer", "Screenplay", "Author"].includes(person.job))
    .slice(0, 2);

  const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  
  const arrowVariant = {
    initial: { x: 0 },
    hover: { 
      x: 6, 
      transition: { repeat: Infinity, duration: 0.6, repeatType: "reverse", ease: "easeInOut" } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="relative w-full pb-20"
    >
      {/* 1. Cinematic Backdrop */}
      <div className="absolute -top-26 left-0 lg:-left-10 w-[100vw] h-[650px] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/90 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 px-6 lg:px-0">
        <GoBackBtn />

        <div className="flex flex-col lg:flex-row gap-12 mt-10">
          {/* Poster */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="shrink-0 mx-auto lg:mx-0"
          >
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
              className="w-64 md:w-72 rounded-2xl shadow-2xl border border-white/5"
              alt={movie.title}
            />
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-400 mb-6">
              <span className="flex items-center gap-1 text-[#FFC509] bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                <IoStar size={16} /> {movie.vote_average?.toFixed(1)}
              </span>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              <span>{movie.runtime}m</span>
              <span className="text-[10px] text-green-400 font-black uppercase tracking-widest border border-green-400/20 px-2.5 py-1 rounded">
                MOVIE
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trailer && (
                <button 
                  onClick={() => setTrailerKey(trailer.key)} 
                  className="flex items-center px-6 py-2.5 bg-[#FFC509] hover:bg-white transition-all rounded-xl text-black font-bold gap-2 active:scale-95"
                >
                  <IoPlay size={20} /> TRAILER
                </button>
              )}
              <WatchlistButton movie={movie} variant="details" />
              <button 
                onClick={() => setOpenReview(true)} 
                className="flex items-center px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold gap-2 transition-all"
              >
                <IoCreateOutline size={20} className="text-green-400" /> WRITE REVIEW
              </button>
            </div>

            <p className="text-neutral-300 leading-relaxed text-base mb-10 max-w-3xl italic font-medium">
              {movie.overview}
            </p>

            {/* Crew */}
            <div className="flex flex-wrap gap-8 mb-8 pb-8 border-b border-white/5">
              {director && (
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Director</h3>
                  <p className="text-sm font-bold text-white hover:text-[#FFC509] cursor-pointer transition-colors" 
                    onClick={() => navigate(`/person/${director.id}`)}>
                    {director.name}
                  </p>
                </div>
              )}
              {writers?.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Writers</h3>
                  <p className="text-sm font-bold text-white">
                    {writers.map((w, i) => (
                      <span key={`writer-${w.id}-${i}`} // Composite key to prevent duplicates
                            className="hover:text-[#FFC509] cursor-pointer transition-colors"
                            onClick={() => navigate(`/person/${w.id}`)}>
                        {w.name}{i < writers.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            {/* Cast Scroller */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Cast</h3>
                <motion.button 
                  whileHover="hover" initial="initial"
                  onClick={() => navigate(`/movie/${movie.id}/cast-crew`)}
                  className="text-[10px] font-bold text-[#FFC509] flex items-center gap-2 uppercase tracking-widest"
                >
                  Full Cast <motion.span variants={arrowVariant}><HiOutlineArrowLongRight size={18} /></motion.span>
                </motion.button>
              </div>
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
                {movie.credits?.cast?.slice(0, 10).map((actor, idx) => (
                  <div key={`actor-${actor.id}-${idx}`} onClick={() => navigate(`/person/${actor.id}`)} className="text-center min-w-[64px] cursor-pointer group">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : userPlaceholder}
                      className="w-14 h-14 rounded-full object-cover border border-white/5 group-hover:border-green-400/50 transition-all duration-300"
                      alt={actor.name}
                    />
                    <p className="text-[10px] mt-2 font-medium text-neutral-500 group-hover:text-white truncate transition-colors">
                        {actor.name.split(' ')[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2. Reviews Section */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">User Reviews</h2>
              <div className="h-1 w-10 bg-[#FFC509] rounded-full" />
            </div>
            <motion.button 
              whileHover="hover" initial="initial"
              onClick={() => navigate(`/movie/${id}/reviews`)}
              className="text-[10px] font-bold text-[#FFC509] flex items-center gap-2 uppercase tracking-widest"
            >
              All Reviews <motion.span variants={arrowVariant}><HiOutlineArrowLongRight size={18} /></motion.span>
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {displayReviews.length > 0 ? displayReviews.map((r, index) => {
              // FIX: Ensure we have a unique key even if API IDs clash
              const reviewKey = r._id || r.id || `review-${index}`;
              
              return (
                <motion.div 
                  key={reviewKey}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                  className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group overflow-hidden"
                >
                  <RiDoubleQuotesL className="absolute -top-2 -right-2 text-white/[0.03] size-24 pointer-events-none" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFC509] to-orange-500 flex items-center justify-center text-black font-black text-[10px]">
                        {(r.userName || r.username || r.author || "?")[0]}
                        </div>
                        <span className="text-sm font-bold tracking-tight">{r.userName || r.username || r.author}</span>
                        {(r.userName || r.username) && <span className="text-[8px] px-2 py-0.5 bg-green-400/20 text-green-400 rounded-full font-black uppercase">CineMood</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#FFC509] font-black text-xs tracking-widest">
                          ★ {r.rating || r.author_details?.rating || "?"}
                        </span>
                        {(r.userName || r.username) && (
                          <button 
                            onClick={() => setReportingReview(r)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-400 p-1"
                          >
                            <Flag size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3 italic font-medium">
                      "{r.content || r.text}"
                    </p>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-2 py-12 text-center bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                <p className="text-neutral-600 font-bold uppercase tracking-widest text-xs font-black italic">No Reviews Found...</p>
              </div>
            )}
          </div>
        </section>

        {/* Similar Movies */}
        <section className="mt-20">
          <MovieCard
            title="Neural Matches"
            fetchFn={() => fetchSimilarMovies(id)}
            onSelectMovie={(movie) => setSelectedMovie(movie)}
          />
        </section>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {reportingReview && (
          <ReportModal review={reportingReview} onClose={() => setReportingReview(null)} />
        )}
        {openReview && (
          <ReviewModal movie={movie} onClose={() => setOpenReview(false)} />
        )}
        {selectedMovie && (
          <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
        {trailerKey && (
          <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
        )}
      </AnimatePresence>
      <ScrollToTopButton />
    </motion.div>
  );
};

export default MovieDetails;
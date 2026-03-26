import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMovieDetails, fetchMovieReviews } from "../services/tmbdApi";
import GoBackBtn from "../components/ui/GoBackBtn";
import ReviewModal from "../components/modals/ReviewModal";
import FullReviewModal from "../components/modals/FullReviewModal";
import { useReviews } from "../services/useReviews";
import { IoStar, IoCreateOutline } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";

const MovieReviews = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [selectedFullReview, setSelectedFullReview] = useState(null);
  const [tmdbReviews, setTmdbReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);
    fetchMovieReviews(id, 1).then(data => setTmdbReviews(data.results || []));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const { reviews: cinemoodReviews } = useReviews(id);

  const displayReviews = [
    ...cinemoodReviews,
    ...tmdbReviews.filter(tmdb => !cinemoodReviews.find(c => c.id === tmdb.id))
  ];

  if (!movie) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pb-20">
      
      {/* Cinematic Header Background */}
      <div className="absolute -top-26 left-0 lg:-left-10 w-[100vw] h-[500px] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10">
        <GoBackBtn />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row gap-8 items-center mt-6 mb-16">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-44 md:w-52 rounded-2xl shadow-2xl border border-white/5"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{movie.title}</h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-neutral-400 mb-6">
              <span className="text-[#FFC509] font-black">★ {movie.vote_average?.toFixed(1)}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span>{displayReviews.length} Reviews</span>
            </div>
            <button 
              onClick={() => setOpenPostModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#FFC509] hover:bg-white text-black font-bold rounded-xl transition-all active:scale-95"
            >
              <IoCreateOutline size={20} /> WRITE REVIEW
            </button>
          </div>
        </header>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayReviews.map((r, index) => {
            const isCinemood = !!r.userName;
            const content = r.content || r.text;
            const author = r.userName || r.author;
            const rating = r.rating || r.author_details?.rating || "?";

            return (
            <motion.div
              key={r.id || index}
              onClick={() => setSelectedFullReview(r)}
              className={`group relative p-6 rounded-3xl cursor-pointer border transition-all duration-500 overflow-hidden ${
                isCinemood 
                  ? 'bg-[#FFC509]/[0.03] border-[#FFC509]/20 hover:border-[#FFC509]/50' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              {/* Background Quote Icon for the Card */}
              <RiDoubleQuotesL className="absolute -top-2 -right-2 text-white/[0.03] size-24 pointer-events-none transition-transform group-hover:scale-110" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-black font-black text-xs ${isCinemood ? 'bg-[#FFC509]' : 'bg-zinc-700 text-white'}`}>
                      {author[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold truncate max-w-[120px]">{author}</h4>
                      {isCinemood && <span className="text-[8px] text-[#FFC509] font-black uppercase tracking-widest">CineMood Signal</span>}
                    </div>
                  </div>
                  <span className="text-[#FFC509] font-black text-xs">★ {rating}</span>
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed line-clamp-4 group-hover:text-neutral-200 transition-colors">
                  "{content}"
                </p>

                <button className="mt-4 text-[10px] font-black text-[#FFC509] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  Expand Review  →
                </button>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {openPostModal && (
          <ReviewModal movie={movie} onClose={() => setOpenPostModal(false)} />
        )}
        {selectedFullReview && (
          <FullReviewModal 
            review={selectedFullReview} 
            onClose={() => setSelectedFullReview(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MovieReviews;
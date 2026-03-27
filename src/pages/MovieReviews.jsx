import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMovieDetails, fetchMovieReviews } from "../services/tmbdApi";
import GoBackBtn from "../components/ui/GoBackBtn";
import ReviewModal from "../components/modals/ReviewModal";
import FullReviewModal from "../components/modals/FullReviewModal";
import ReportModal from "../components/modals/ReportModal"; // Import your Report Modal
import { useReviews } from "../services/useReviews";
import { IoStar, IoCreateOutline } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";
import { Flag } from "lucide-react"; // For the report icon
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

const MovieReviews = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [selectedFullReview, setSelectedFullReview] = useState(null);
  const [reportingReview, setReportingReview] = useState(null); // State for reporting
  const [tmdbReviews, setTmdbReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);
    fetchMovieReviews(id, 1).then(data => setTmdbReviews(data.results || []));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const { reviews: cinemoodReviews } = useReviews(id);

  // Merge reviews and filter out duplicates
  const displayReviews = [
    ...cinemoodReviews,
    ...tmdbReviews.filter(tmdb => !cinemoodReviews.find(c => c.movieId === tmdb.id?.toString()))
  ];

  if (!movie) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pb-20 px-4 md:px-0">
      
      {/* Cinematic Header Background - Responsive Height */}
      <div className="absolute -top-26 left-0 w-full h-[400px] md:h-[500px] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <GoBackBtn />

        {/* Header Section - Stacked on mobile, side-by-side on md+ */}
        <header className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-end mt-8 mb-12 md:mb-20">
          <motion.img 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-40 md:w-52 rounded-2xl shadow-2xl border border-white/5"
            alt={movie.title}
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-3 leading-tight">
              {movie.title} <span className="text-neutral-600 italic font-light">Reviews</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs md:text-sm font-bold text-neutral-400 mb-8">
              <span className="flex items-center gap-1 text-[#FFC509] bg-[#FFC509]/10 px-2 py-1 rounded-md">
                <IoStar size={14} /> {movie.vote_average?.toFixed(1)}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span className="uppercase tracking-widest">{displayReviews.length} Feedbacks</span>
            </div>
            <button 
              onClick={() => setOpenPostModal(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC509] hover:bg-white text-black font-black rounded-2xl transition-all active:scale-95 shadow-[0_10px_20px_rgba(255,197,9,0.2)]"
            >
              <IoCreateOutline size={22} /> WRITE A REVIEW
            </button>
          </div>
        </header>

        {/* Reviews Grid - 1 col on mobile, 2 on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {displayReviews.map((r, index) => {
            const isCinemood = !!r.userName;
            const content = r.content || r.text;
            const author = r.userName || r.author;
            const rating = r.rating || r.author_details?.rating || "?";

            return (
              <motion.div
                key={r._id || r.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedFullReview(r)}
                className={`group relative p-6 md:p-8 rounded-[2rem] cursor-pointer border transition-all duration-500 ${
                  isCinemood 
                    ? 'bg-gradient-to-br from-[#FFC509]/[0.05] to-transparent border-[#FFC509]/10 hover:border-[#FFC509]/40' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <RiDoubleQuotesL className="absolute -top-2 -right-2 text-white/[0.03] size-24 pointer-events-none group-hover:scale-110 transition-transform" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-sm shadow-inner ${isCinemood ? 'bg-[#FFC509]' : 'bg-zinc-800 text-white'}`}>
                        {author[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold truncate max-w-[140px] md:max-w-[180px]">{author}</h4>
                        {isCinemood && (
                          <span className="text-[9px] text-[#FFC509] font-black uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#FFC509] animate-pulse" /> CineMood User
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#FFC509] font-black text-sm bg-black/40 px-2 py-1 rounded-lg border border-white/5">★ {rating}</span>
                      
                      {/* REPORT BUTTON: Only for Cinemood reviews, stopPropagation prevents modal overlap */}
                      {isCinemood && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportingReview(r);
                          }}
                          className="md:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-600 hover:text-red-500 bg-white/5 rounded-lg"
                          title="Report Review"
                        >
                          <Flag size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-4 group-hover:text-neutral-200 transition-colors italic">
                    "{content}"
                  </p>

                  <div className="mt-6 flex justify-between items-center">
                    <button className="text-[10px] font-black text-[#FFC509] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      View Full Review <span>→</span>
                    </button>
                    {r.createdAt && (
                       <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">
                         {new Date(r.createdAt).toLocaleDateString()}
                       </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modals Container */}
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
        {reportingReview && (
          <ReportModal 
            review={reportingReview} 
            onClose={() => setReportingReview(null)} 
          />
        )}
      </AnimatePresence>
      <ScrollToTopButton />
    </motion.div>
  );
};

export default MovieReviews;
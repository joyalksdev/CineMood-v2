import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbMovie, TbStar } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import WatchlistButton from "../ui/WatchlistButton";
import mHPlaceholder from "../../assets/m-h-placeholder.png";
import ReviewModal from "./ReviewModal";
import { Star } from "lucide-react";

const QuickViewModal = ({ movie, onClose }) => {
  const modalRef = useRef();
  const navigate = useNavigate();
  const [openReview, setOpenReview] = useState(false);

  // --- DATA FIXES ---
  const backdrop = movie?.backdrop_path?.trim();

  // Use optional chaining and a fallback to 0 before calling toFixed
  const rawRating = movie?.rating ?? movie?.vote_average ?? 0;
  const displayRating = Number(rawRating).toFixed(1);

  // Ensure popularity is a number
  const isTrending =
    Number(movie?.popularity) > 500 || movie?.media_type === "movie";

  // 3. Genre Map
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Doc",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  // 4. FIX: If genre_ids is missing in the object, show a default or check 'genres' array
  const genresToDisplay = movie.genre_ids
    ? movie.genre_ids.slice(0, 3).map((id) => genreMap[id])
    : movie.genres
      ? movie.genres.slice(0, 3).map((g) => g.name)
      : ["Movie"]; // Fallback if both are missing

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="bg-[#0b0b0b] text-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 relative"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-yellow-400 hover:text-black transition z-20 border border-white/10"
            >
              ✕
            </button>

            <div className="relative h-[280px] md:h-[320px]">
              <img
                src={
                  backdrop
                    ? `https://image.tmdb.org/t/p/original${backdrop}`
                    : mHPlaceholder
                }
                className="w-full h-full object-cover"
                alt={movie.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent" />

              <div className="absolute bottom-0 left-10 right-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-[#FFC509] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/20 backdrop-blur-lg">
                    <Star fill="#FFC509" size={13} /> {displayRating}
                  </span>

                  {/* Trending Badge*/}
                  {isTrending && (
                    <span className="bg-[#FFC509] text-black text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-tighter shadow-xl">
                      Trending
                    </span>
                  )}

                  {/* Recommended Badge (Using corrected displayRating) */}
                  {displayRating >= 7 && (
                    <span className="bg-green-500 text-black text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-tighter shadow-xl flex items-center gap-1">
                      <TbStar className="fill-black" /> Recommended
                    </span>
                  )}

                  <span className="text-white/60 text-xs font-bold tracking-widest ml-1">
                    {movie.release_date?.split("-")[0]}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[0.85] italic drop-shadow-2xl">
                  {movie.title}
                </h2>
              </div>
            </div>

            <div className="px-10 py-8 bg-[#0b0b0b]">
              {/* Genres Row (Using corrected genresToDisplay) */}
              <div className="flex flex-wrap gap-2 mb-5">
                {genresToDisplay.map((name, index) => (
                  <span
                    key={index}
                    className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400/80 font-bold uppercase tracking-widest"
                  >
                    {name}
                  </span>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-neutral-400 line-clamp-3 font-medium opacity-90">
                {movie.overview}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="flex-1 min-w-[160px] h-14 flex gap-3 items-center justify-center bg-yellow-400 rounded-2xl hover:bg-yellow-300 transition font-black text-black shadow-xl text-xs uppercase tracking-widest active:scale-95"
                >
                  <TbMovie size={20} /> View Details
                </button>

                <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-[14px] flex items-center justify-center transition hover:bg-white/10">
                  <WatchlistButton movie={movie} variant="modal" />
                </div>

                <button
                  onClick={() => setOpenReview(true)}
                  className="px-6 h-14 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition text-white/80 active:scale-95"
                >
                  ✍ Review
                </button>
              </div>

              {openReview && (
                <ReviewModal
                  movie={movie}
                  onClose={() => setOpenReview(false)}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;

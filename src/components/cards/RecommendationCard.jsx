import React, { useEffect, useRef, useState } from "react";
import { fetchPersonalizedMovies } from "../../services/tmbdApi";
import { GoPlusCircle } from "react-icons/go";
import { useUser } from "../../context/UserContext";
import QuickViewModal from "../modals/QuickViewModal";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWatchlist } from "../../context/WatchlistContext";
import WatchlistButton from "../ui/WatchlistButton";
import userPlaceholder from "../../assets/user-placeholder.png";
import moviePlaceholder from "../../assets/m-placeholder.png";
import CardSkelton from "./CardSkelton";

const RecommendationCard = () => {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const { addToWatchlist } = useWatchlist();

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
    if (!rowRef.current) return;
    const width = rowRef.current.clientWidth;
    rowRef.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  return (
    <section>
      {selectedMovie && (
        <QuickViewModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold heading text-xl md:text-2xl">
            🎯 Recommended for You
          </h2>
          <p className="p-1 font-medium text-neutral-200/50 text-sm">
            Movies selected based on what you love.
          </p>
        </div>

        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="group flex items-center justify-center w-10 h-10 
            rounded-full bg-black/40 backdrop-blur-md hover:bg-[#FFC509] 
            transition-all duration-200"
          >
            <ChevronLeft
              className="text-white group-hover:text-black"
              size={26}
            />
          </button>

          <button
            onClick={() => scroll("right")}
            className="group flex items-center justify-center w-10 h-10 
            rounded-full bg-black/40 backdrop-blur-md hover:bg-[#FFC509] 
            transition-all duration-200"
          >
            <ChevronRight
              className="text-white group-hover:text-black"
              size={26}
            />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-2 md:gap-6 overflow-x-auto scrollbar-hide px-1 md:px-6 py-4"
      >
       {loading && [...Array(6)].map((_, i) => <CardSkelton key={i} />)}

      {!loading && movies.length === 0 && (
        <p className="text-neutral-400 px-4">
          Select genres during onboarding to get personalized recommendations.
        </p>
      )}

      {!loading &&
        movies.map((movie) => (
            <div
              key={movie.id}
              className="relative min-w-[120px] md:min-w-[250px] max-w-[200px] md:max-w-[490px] 
             bg-zinc-900 border border-gray-500/40 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">

              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : moviePlaceholder
                }
                className="w-full h-[180px] md:h-[320px] object-cover"
                onClick={() => setSelectedMovie(movie)}
                alt={movie.title}
              />

              <div className="p-4 hidden md:block">
                <h3 className="text-white text-sm font-semibold truncate">
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-400">
                 ⭐ {movie.rating ? movie.rating.toFixed(1) : "0.0"}
                </p>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setSelectedMovie(movie)}
                    className="text-md px-7 py-1 rounded-2xl bg-[#FFC509] cursor-pointer hover:bg-amber-300 font-medium text-black"
                  >
                    View Details
                  </button>

                  <WatchlistButton movie={movie} variant="card" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default RecommendationCard;

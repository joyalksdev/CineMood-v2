import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails, fetchMovieReviews } from "../services/tmbdApi";
import GoBackBtn from "../components/ui/GoBackBtn";
import ReviewModal from "../components/modals/ReviewModal";
import { useReviews } from "../services/useReviews";

const MovieReviews = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [openReview, setOpenReview] = useState(false);
  const [tmdbReviews, setTmdbReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);
  }, [id]);

  useEffect(() => {
    const loadTmdbReviews = async () => {
      const data = await fetchMovieReviews(id, 1);
      setTmdbReviews(data.results || []);
    };
    loadTmdbReviews();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Load Cinemood reviews using useReviews hook
  const { reviews: cinemoodReviews, loading } = useReviews(movie?.id);

  // Merge reviews: Cinemood reviews first, then TMDB reviews
  const displayReviews = [
    ...cinemoodReviews,
    ...tmdbReviews.filter(
      (tmdb) => !cinemoodReviews.find((c) => c.id === tmdb.id),
    ),
  ];

  if (!movie)
    return <p className="text-white text-center mt-20">Loading movie...</p>;

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black rounded-2xl text-white pb-16 pt-2 px-6">
      <GoBackBtn />

      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
        <header className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-52 h-72 object-cover rounded-2xl shadow-xl"
          />

          <div className="flex-1">
            <h2 className="text-4xl font-bold">{movie.title}</h2>
            <p className="text-neutral-400 mt-2">
              ⭐ {movie.vote_average} / 10 • {displayReviews.length} Reviews
            </p>

            <p className="text-neutral-300 mt-4 max-w-xl leading-relaxed">
              {movie.overview}
            </p>

            <button
              onClick={() => setOpenReview(true)}
              className="px-4 py-2 mt-2 bg-yellow-400 text-black cursor-pointer font-semibold rounded-lg"
            >
              Post Review
            </button>

            {openReview && (
              <ReviewModal movie={movie} onClose={() => setOpenReview(false)} />
            )}
          </div>
        </header>
      </div>

      <section className="py-10">
        <h2 className="text-2xl font-bold heading mb-6">⭐ User Reviews</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {displayReviews.map((r) =>
          // CINEMOOD REVIEWs
            r.userName ? (
              <div
                key={r._id || r.id} // MongoDB uses _id
                className="bg-neutral-900 p-4 rounded-xl border border-yellow-400/40"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                  
                    <img
                      src={
                        r.userAvatar ||
                        `https://api.dicebear.com/7.x/micah/svg?seed=${r.userName}`
                      }
                      className="w-6 h-6 rounded-full object-cover"
                      alt="profile"
                    />
                    {r.userName} 
                    <span className="bg-[#FFC509] text-black text-xs px-2 py-0.5 rounded-full">
                      CineMood User
                    </span>
                  </span>
                  <span className="text-[#FFC509]">⭐ {r.rating}/10</span>
                </div>
                <p className="mt-2 text-sm text-neutral-200 line-clamp-4">
                  {r.content} 
                </p>
              </div>
            ) : (
              // TMDB REVIEWs
              <div
                key={r.id}
                className="bg-neutral-800/70 p-4 rounded-xl border border-white/10"
              >
                <div className="flex justify-between items-center text-sm text-neutral-400">
                  <span>{r.author}</span>
                  {r.author_details?.rating && (
                    <span className="text-[#FFC509]">
                      ⭐ {r.author_details.rating}/10
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-neutral-300 line-clamp-4">
                  {r.content}
                </p>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieReviews;

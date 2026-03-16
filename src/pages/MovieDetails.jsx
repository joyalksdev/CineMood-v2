import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  fetchMovieReviews,
} from "../services/tmbdApi";
import QuickViewModal from "../components/modals/QuickViewModal";
import TrailerModal from "../components/modals/TrailerModal";
import { FadeLoader } from "react-spinners";
import WatchlistButton from "../components/ui/WatchlistButton";
import { IoPlay } from "react-icons/io5";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import userPlaceholder from "../assets/user-placeholder.png";
import moviePlaceholder from "../assets/m-placeholder.png";
import MovieCard from "../components/cards/MovieCard";
import { useReviews } from "../services/useReviews";
import ReviewModal from "../components/modals/ReviewModal";
import GoBackBtn from "../components/ui/GoBackBtn";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [tmdbReviews, setTmdbReviews] = useState([]);

  const navigate = useNavigate();
  const [openReview, setOpenReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      const movieData = await fetchMovieDetails(id);
      setMovie(movieData);

      const tmdb = await fetchMovieReviews(id, 1);
      setTmdbReviews(tmdb.results || []);

      const similarData = await fetchSimilarMovies(id);
      setSimilar(similarData);

      setSelectedMovie(null);
      setTrailerKey(null);
    };

    load();
  }, [id]);

    // Load Cinemood reviews using useReviews hook
  const { reviews, loading } = useReviews(movie?.id);

    // Use Cinemood reviews first, fallback to TMDB reviews
  const displayReviews =
    reviews.length > 0 ? reviews.slice(0, 4) : tmdbReviews.slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!movie)
    return (
      <div className="p-6 ">
        <FadeLoader
          className="mx-auto mb-5"
          color="#FFC509"
          radius={-5}
          speedMultiplier={1}
          width={4}
          loading
        />
      </div>
    );

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const director = movie?.credits?.crew?.find((p) => p.job === "Director");

  const writers =
    movie?.credits?.crew?.filter((p) =>
      ["Writer", "Screenplay", "Story"].includes(p.job)
    ) || [];

  return (
    <div className="px-8 pb-6">
      <GoBackBtn />

      <div className="flex flex-col lg:flex-row gap-8">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : moviePlaceholder
          }
          className="w-72 rounded-xl shadow-xl"
        />
        <div>
          <h2 className="heading font-semibold text-3xl">{movie.title}</h2>

          <div className="flex flex-col md:flex-row gap-3 mt-3 md:items-center">
            <div className="flex gap-3">
              {trailer && (
                <button
                  onClick={() => setTrailerKey(trailer.key)}
                  className="flex items-center px-4 gap-1 py-2 bg-[#FFC509] cursor-pointer hover:bg-amber-300 rounded-lg text-black font-medium"
                >
                  <IoPlay /> Watch Trailer
                </button>
              )}

              <WatchlistButton movie={movie} variant="details" />
            </div>

            <button
              onClick={() => setOpenReview(true)}
              className="py-2 px-4 hidden bg-neutral-800 rounded-lg border border-neutral-600 hover:bg-neutral-200 hover:text-black text-yellow-200 transition ease-in-out cursor-pointer"
            >
              ✍ Write Review
            </button>
          </div>

          <p className="text-neutral-400 mt-2">
            {movie.release_date} • {movie.runtime} min
          </p>

          <p className="mt-4 text-lg leading-relaxed max-w-300 text-neutral-200">
            {movie.overview}
          </p>

          <div className="flex gap-3 mt-3">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="px-3 py-2 text-sm rounded-full border border-neutral-500"
              >
                {g.name}
              </span>
            ))}
          </div>

          <section className="mt-2 px-2">
            <div className="flex justify-between items-start">
              <h2 className="py-3 text-xl font-bold">Cast Crew</h2>
              <button
                onClick={() => navigate(`/movie/${movie.id}/cast-crew`)}
                className="mt-4 text-sm flex items-center gap-1 cursor-pointer text-[#FFC509] hover:underline"
              >
                View Full Cast & Crew <HiOutlineArrowLongRight size={23} />
              </button>
            </div>
            <div className="grid grid-cols-4 md:flex gap-5 ">
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => navigate(`/person/${actor.id}`)}
                  className="text-center max-w-[70px] hover:scale-105 ease-in-out duration-200 cursor-pointer"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : userPlaceholder
                    }
                    className="rounded-full aspect-square object-cover"
                  />

                  <p className="text-sm mt-1">{actor.name} </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-2 pt-1 flex flex-col gap-3">
              {director && (
                <p className="text-sm text-neutral-300">
                  <span className="text-neutral-400">Director:</span>{" "}
                  <span
                    onClick={() => navigate(`/person/${director.id}`)}
                    className="hover:text-[#FFC509] cursor-pointer"
                  >
                    {director.name}
                  </span>
                </p>
              )}

              {writers.length > 0 && (
                <p className="text-sm text-neutral-300">
                  <span className="text-neutral-400">Writers:</span>{" "}
                  {writers.slice(0, 3).map((w, i) => (
                    <span
                      key={w.id}
                      onClick={() => navigate(`/person/${w.id}`)}
                      className="hover:text-[#FFC509] cursor-pointer"
                    >
                      {w.name}
                      {i < writers.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-3">⭐Reviews</h2>

          {openReview && (
            <ReviewModal movie={movie} onClose={() => setOpenReview(false)} />
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenReview(true)}
              className="px-4 py-2 bg-[#FFC509] text-black rounded-lg font-medium hover:bg-amber-300 transition"
            >
              ✍ Write Review
            </button>

            <button
              onClick={() => navigate(`/movie/${id}/reviews`)}
              className="flex gap-1 text-[#FFC509] cursor-pointer hover:underline items-center"
            >
              View all reviews <HiOutlineArrowLongRight size={23} />
            </button>
          </div>
        </div>

        {loading && <p className="text-neutral-400">Loading reviews...</p>}

        {!loading && reviews.length === 0 && tmdbReviews.length === 0 && (
          <p className="text-neutral-500">Be the first to review this movie.</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {displayReviews.map((r) =>
            r.username ? (
              // CINEMOOD REVIEW
              <div
                key={r.id}
                className="bg-neutral-900 p-4 rounded-xl border border-yellow-400/40"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    {r.username}
                    <span className="bg-[#FFC509] text-black text-xs px-2 py-0.5 rounded-full">
                      Cinemood User
                    </span>
                  </span>
                  <span className="text-[#FFC509]">⭐ {r.rating}/5</span>
                </div>
                <p className="mt-2 text-sm text-neutral-200 line-clamp-4">
                  {r.text}
                </p>
              </div>
            ) : (
              // TMDB REVIEW
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
            )
          )}
        </div>
      </section>

      <section className="mt-10">
        <MovieCard
          title="🎬 Similar Movies"
          fetchFn={() => fetchSimilarMovies(id)}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
        />

        {selectedMovie && (
          <QuickViewModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </section>

      {trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  );
};

export default MovieDetails;

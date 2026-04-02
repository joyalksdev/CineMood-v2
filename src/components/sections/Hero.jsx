import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchTrendingMovies } from "../../services/tmbdApi";
import moviePlaceholder from "../../assets/m-placeholder.png"

export default function Hero({ onAboutClick }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchTrendingMovies().then((data) => {
      // handles varying data structures from the backend/API
      const movieData = data.data || data.results || data;
      if (Array.isArray(movieData)) {
        setMovies(movieData);
      }
    });
  }, []);

  return (
    <div className="relative h-screen w-full rounded-2xl overflow-hidden">
      {/* Background Poster Wall with scrolling animation */}
      <div className="absolute -inset-x-40 -inset-y-32 overflow-hidden">
        <div className="absolute lg:-top-50 md:-top-10 sm:-top-30 left-0 w-[200%] grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-14 scale-125 -rotate-12 gap-3 animate-scroll">
          {[...movies, ...movies].map((movie, i) => (
            <img
              key={movie.id + i}
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : moviePlaceholder}
              className="w-full h-full object-cover rounded-lg aspect-[2/3]"
              alt={movie.title}
              loading="lazy"
            />
          ))}
        </div>
        {/* overlay gradient to ensure text readability */}
        <div className="absolute inset-[-120px] bg-gradient-to-b from-black/90 via-black/70 to-black"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[90%] text-center px-6">
        <div className="max-w-180 flex flex-col mb-3 gap-3">
          <h2 className="heading text-4xl sm:text-5xl md:text-6xl font-normal">
            <span className="font-semibold">Discover cinema</span> the way it
            was <span className="font-semibold">meant to be explored.</span>
          </h2>
          <p className="text-md md:text-lg text-white/70">
            Explore trending titles, deep-dive into film details, build your
            watchlist and discover movies made just for your taste.
          </p>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col mt-2 sm:flex-row gap-3">
          <Link to="/browse">
            <button className="px-6 py-2.5 bg-[#FFC509] text-black font-bold rounded-xl hover:bg-amber-300 cursor-pointer hover:shadow-xl shadow-amber-300/10 transition-all">
              Start Exploring
            </button>
          </Link>
          <button 
            onClick={onAboutClick} 
            className="px-6 py-2.5 border border-[#FFC509] text-[#FFC509] font-bold rounded-xl backdrop-blur-md cursor-pointer hover:bg-[#FFC509]/10 transition-all"
          >
           About Cinemood
          </button>
        </div>
      </div>

      {/* Component-specific keyframe styles */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 35s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
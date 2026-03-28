import React from 'react'
import { Info } from "lucide-react"
import WatchlistButton from "../ui/WatchlistButton"
import Tooltip from "../ui/Tooltip"
import moviePlaceholder from "../../assets/m-placeholder.png"

const MovieGridCard = ({ movie, onSelectMovie }) => {
  // Logic to handle both custom 'rating' and TMDB 'vote_average'
  const rating = movie.rating || movie.vote_average || 0;
  const displayRating = rating.toFixed(1);
  const displayYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
   <div 
      className="group flex flex-col cursor-pointer snap-start w-full"
      onClick={() => onSelectMovie(movie)}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 transition-all duration-500 group-hover:border-[#FFC509]/30 shadow-lg">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.4]"
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#FFC509] border border-white/10 z-10">
          ★ {displayRating}
        </div>

        {/* Hover Controls */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="relative flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <button className="flex-1 h-10 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#FFC509] transition-colors">
                <Info size={14} strokeWidth={3} /> Info
             </button>
             <WatchlistButton movie={movie} variant="card" />
          </div>
        </div>
      </div>

      {/* Title Section with Line-Clamp Fix */}
      <div className="mt-3 px-1 w-full">
        <Tooltip text={movie.title} active={movie.title?.length > 23}>
          <h3 className="text-[13px] md:text-sm font-bold text-white group-hover:text-[#FFC509] transition-colors duration-300 leading-tight
                         line-clamp-2 overflow-hidden display-webkit-box webkit-box-orient-vertical">
            {movie.title}
          </h3>
        </Tooltip>
        
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
            {displayYear}
          </p>
          <span className="w-1 h-1 rounded-full bg-neutral-800" />
          <p className="text-[9px] text-green-500 font-black uppercase tracking-[0.1em]">
            {movie.media_type || 'Movie'}
          </p>
        </div> 
      </div>
    </div>
  )
}

export default MovieGridCard
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Info, Star, Play } from "lucide-react"
import moviePlaceholder from "../../assets/m-placeholder.png"
import WatchlistButton from "../ui/WatchlistButton"
import Tooltip from "../ui/Tooltip"
import { motion } from "framer-motion"

const MovieCard = ({ title, fetchFn, onSelectMovie }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const rowRef = useRef(null)

  // fetching movies on mount and handling memory leaks with isMounted
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetchFn().then(data => {
      if (isMounted) {
        setMovies(data)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [fetchFn])

  // smooth horizontal scroll logic for the movie row
  const scroll = (direction) => {
    if (rowRef.current) {
      const width = rowRef.current.clientWidth * 0.8
      rowRef.current.scrollBy({
        left: direction === "left" ? -width : width,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="py-10">
      {/* section title and scroll buttons */}
      <div className="flex justify-between items-end mb-6 px-4 md:px-10">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight italic">
            {title}
          </h2>
          <div className="h-1 w-12 bg-green-400 rounded-full" />
        </div>

        <div className="hidden lg:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#FFC509] hover:text-black hover:border-[#FFC509] transition-all duration-300"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#FFC509] hover:text-black hover:border-[#FFC509] transition-all duration-300"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* movie list container with snap scrolling */}
      <div 
        ref={rowRef} data-lenis-prevent 
        className="flex gap-5 md:gap-7 overflow-x-auto scrollbar-hide px-4 md:px-10 py-4 snap-x"
      >
        {loading ? (
           // skeleton loaders while data is fetching
           [...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[160px] md:min-w-[240px] aspect-[2/3] bg-white/5 rounded-3xl animate-pulse border border-white/5" />
          ))
        ) : (
          movies.map((movie, i) => {
            const displayRating = movie.rating || movie.vote_average ? (movie.rating || movie.vote_average).toFixed(1) : "0.0";
            const displayYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col min-w-[160px] md:min-w-[230px] snap-start cursor-pointer relative"
                onClick={() => onSelectMovie(movie)}
              >
                <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 transition-all duration-500 group-hover:border-[#FFC509]/50 shadow-lg">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-40"
                    loading="lazy"
                  />

                  {/* hover overlay with info and watchlist actions */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <div className="flex items-center gap-3">
                      <button className="flex-1 h-12 bg-white text-black text-[11px] font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-95">
                        <Info size={18} /> Info
                      </button>
                      
                      <div className="shrink-0">
                        <WatchlistButton 
                          movie={movie} 
                          variant="card" 
                          className="h-12 w-12 rounded-2xl border-none transition-all active:scale-95" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* movie details section */}
                <div className="mt-4 px-2 overflow-hidden"> 
                    <Tooltip text={movie.title} active={movie.title?.length > 20}>
                      <h3 className="text-[14px] md:text-[15px] font-bold text-white truncate block w-full group-hover:text-[#FFC509] transition-colors duration-300">
                        {movie.title}
                      </h3>
                    </Tooltip>
                    
                    <div className="flex items-center gap-2 mt-1.5 opacity-80">
                      <p className="text-[11px] text-neutral-500 font-semibold shrink-0">
                        {displayYear}
                      </p>
                      
                      <span className="w-1 h-1 rounded-full bg-neutral-800 shrink-0" />
                      
                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider truncate">
                        {movie.media_type || 'Movie'}
                      </p>
                    </div>
                  </div>
                
              </motion.div>
            )
          })
        )}
      </div>
    </section>
  )
}

export default MovieCard
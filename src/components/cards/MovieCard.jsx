import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useWatchlist } from '../../context/WatchlistContext'
import moviePlaceholder from "../../assets/m-placeholder.png"

const MovieCard = ({ title, fetchFn, onSelectMovie }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToWatchlist } = useWatchlist()
  const rowRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    fetchFn().then(data => {
      setMovies(data)
      setLoading(false)
    })
  }, [fetchFn])

  const scroll = (direction) => {
    const width = rowRef.current.clientWidth
    rowRef.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth"
    })
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="font-bold heading text-xl md:text-2xl">{title}</h2>

        <div className="hidden lg:flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="group flex items-center justify-center w-10 h-10 
            rounded-full bg-black/40 backdrop-blur-md hover:bg-[#FFC509] transition-all">
            <ChevronLeft className="text-white group-hover:text-black" size={26} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="group flex items-center justify-center w-10 h-10 
            rounded-full bg-black/40 backdrop-blur-md hover:bg-[#FFC509] transition-all">
            <ChevronRight className="text-white group-hover:text-black" size={26} />
          </button>
        </div>
      </div>

      <div ref={rowRef} className="flex gap-2 md:gap-6 overflow-x-auto scrollbar-hide px-1 md:px-6 py-4">
        {!loading && movies.length === 0 && (
          <p className="text-neutral-400 px-4">No movies found</p>
        )}

        {movies.map(movie => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="group relative min-w-[130px] md:min-w-[220px] rounded-xl 
            overflow-hidden bg-neutral-900/40 border border-white/10 shadow-lg 
            hover:scale-105 transition-all duration-300 cursor-pointer">

            <img
               src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
              className="w-full h-50 md:h-80 object-cover"
              loading="lazy"
              alt={movie.title}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
              opacity-0 group-hover:opacity-100 transition" />

            <p className="absolute bottom-3 left-3 right-3 text-sm text-white font-medium 
              opacity-0 group-hover:opacity-100 transition">
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MovieCard

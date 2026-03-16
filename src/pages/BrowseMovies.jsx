import React, { useEffect, useRef, useState } from 'react'
import { fetchBrowseMovies } from "../services/tmbdApi"
import QuickViewModal from '../components/modals/QuickViewModal'
import { FadeLoader } from 'react-spinners'
import CardSkelton from '../components/cards/CardSkelton'
import FilterBar from '../components/search/FilterBar'
import moviePlaceholder from "../assets/m-placeholder.png"

const BrowseMovies = () => {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loaderRef = useRef(null)

  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    sort: "rating"
  })

  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [filters])

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetchBrowseMovies({ ...filters, page }).then(data => {
      if (!isMounted) return
      
      if (data.length === 0) {
        setHasMore(false)
      } else {
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const uniqueNewMovies = data.filter(m => !existingIds.has(m.id))
          return [...prev, ...uniqueNewMovies]
        })
      }
      setLoading(false)
    })

    return () => { isMounted = false }
  }, [filters, page])

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setPage(p => p + 1)
      }
    }, { threshold: 0.1 })

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore])

  return (
    <div className="pt-28 px-6 min-h-screen bg-transparent">
      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Header & FilterBar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Browse Movies</h2>
          <p className="text-neutral-500 text-sm mt-1">Explore by genre, rating, and language.</p>
        </div>
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {movies.map(movie => (
          <div 
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className="group flex flex-col cursor-pointer"
          >
            {/* Poster Container */}
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-[#FFC509]/50">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold text-[#FFC509] border border-white/10 shadow-lg">
                ★ {movie.vote_average?.toFixed(1)}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-4 px-1">
              <h3 className="text-sm md:text-base font-bold text-white truncate group-hover:text-[#FFC509] transition-colors">
                {movie.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 font-medium">
                {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
              </p>
            </div>
          </div>
        ))}

        {loading && [...Array(12)].map((_, i) => <CardSkelton key={i} />)}
      </div>

      {/* End of results indicator */}
      <div ref={loaderRef} className="flex justify-center py-20">
        {hasMore ? (
          <FadeLoader color="#FFC509" loading={loading} />
        ) : (
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <p className="text-neutral-500 text-xs font-bold tracking-widest uppercase">End of Results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseMovies
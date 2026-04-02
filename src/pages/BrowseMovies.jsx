import React, { useEffect, useRef, useState } from 'react'
import { fetchBrowseMovies } from "../services/tmbdApi"
import QuickViewModal from '../components/modals/QuickViewModal'
import { FadeLoader } from 'react-spinners'
import CardSkelton from '../components/cards/CardSkelton'
import FilterBar from '../components/search/FilterBar'
import MovieGridCard from '../components/cards/MovieGridCard' 
import ScrollToTopButton from '../components/ui/ScrollToTopButton'
import  Meta  from '../components/ui/Meta'

const BrowseMovies = () => {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef(null)

  // define initial filter states for genre, language, and sorting
  const [filters, setFilters] = useState({ genre: "", language: "", sort: "rating" })

  // reset movie list and pagination when filters change
  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [filters])

  // handle data fetching from tmdb api with mount guard
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

  // intersection observer for infinite scroll functionality
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
    <div className="px-6 min-h-screen bg-transparent">
      
      {/* meta titles for seo/browser tab */}
      <Meta title="Explore Universe" />

      {/* modal for quick movie details */}
      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* header area heading and subheading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-12">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-5xl font-bold text-white tracking-wide italic">
            Browse Universe
          </h2>
          <p className="text-neutral-500 text-sm md:text-base font-medium max-w-md leading-relaxed">
            Navigate through infinite cinematic dimensions. Filter by genre, language, or rating to find your next escape.
          </p>
          <div className="h-1 w-16 bg-[#4ade80] rounded-full mt-2" />
        </div>
        
        {/* component to manage discovery filters */}
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* grid layout: responsive columns from mobile to ultra-wide */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
        {movies.map(movie => (
          <MovieGridCard 
            key={movie.id} 
            movie={movie} 
            onSelectMovie={setSelectedMovie} 
          />
        ))}

        {/* display skeleton loaders during data fetch */}
        {loading && [...Array(12)].map((_, i) => <CardSkelton key={i} />)}
      </div>

      {/* infinite scroll loader & "end of galaxy" indicator */}
      <div ref={loaderRef} className="flex justify-center py-20">
        {hasMore ? (
          <FadeLoader color="#4ade80" loading={loading} />
        ) : (
          <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <p className="text-neutral-500 text-[10px] font-black tracking-[0.4em] uppercase">End of Galaxy</p>
          </div>
        )}
      </div>
      
      {/* sticky navigation utility */}
      <ScrollToTopButton />
    </div>
  )
}

export default BrowseMovies
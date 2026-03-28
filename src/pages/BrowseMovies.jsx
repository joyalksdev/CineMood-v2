import React, { useEffect, useRef, useState } from 'react'
import { fetchBrowseMovies } from "../services/tmbdApi"
import QuickViewModal from '../components/modals/QuickViewModal'
import { FadeLoader } from 'react-spinners'
import CardSkelton from '../components/cards/CardSkelton'
import FilterBar from '../components/search/FilterBar'
// Import the specific Grid Card component to avoid prop-mismatch errors
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

  const [filters, setFilters] = useState({ genre: "", language: "", sort: "rating" })

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
    <div className="px-6 min-h-screen bg-transparent">
      
      <Meta title="Explore" />

      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-12">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Browse Universe</h2>
          <div className="h-1 w-12 bg-green-400 rounded-full" />
        </div>
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
        {movies.map(movie => (
          <MovieGridCard 
            key={movie.id} 
            movie={movie} 
            onSelectMovie={setSelectedMovie} 
          />
        ))}

        {loading && [...Array(12)].map((_, i) => <CardSkelton key={i} />)}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} className="flex justify-center py-20">
        {hasMore ? (
          <FadeLoader color="#4ade80" loading={loading} />
        ) : (
          <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">End of Galaxy</p>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default BrowseMovies
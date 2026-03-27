import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { discoverByGenre, searchByMoodKeyword } from '../services/tmbdApi'
import { FadeLoader } from 'react-spinners'
import QuickViewModal from '../components/modals/QuickViewModal'
import moviePlaceholder from "../assets/m-placeholder.png"
import ScrollToTopButton from '../components/ui/ScrollToTopButton'

const MoodResults = () => {
  const { state } = useLocation()
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // RESET state when mood/genres change
  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [state])

  // FETCH logic with duplicate prevention
  useEffect(() => {
    if (!state) return
    setLoading(true)

    const handleData = (data) => {
      if (data.length === 0) {
        setHasMore(false)
        return
      }
      setMovies((prev) => {
        const existingIds = new Set(prev.map(m => m.id))
        const uniqueNewMovies = data.filter(m => !existingIds.has(m.id))
        return [...prev, ...uniqueNewMovies]
      })
    }

    if (state?.genres) {
      discoverByGenre(state.genres.join(","), page)
        .then(handleData)
        .finally(() => setLoading(false))
    } else if (state?.mood) {
      searchByMoodKeyword(state.mood, page)
        .then(handleData)
        .finally(() => setLoading(false))
    }
  }, [state, page])

  // INFINITE SCROLL listener
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300 &&
        !loading && hasMore
      ) {
        setPage(p => p + 1)
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [loading, hasMore])

  return (
    <div className="px-6 text-white min-h-screen">
      {selectedMovie && (
        <QuickViewModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Results for: <span className="text-yellow-400 capitalize">{state?.mood || 'Custom Selection'}</span>
          </h1>
          <p className="text-gray-400 mt-2">Discovering movies that match your current vibe.</p>
        </header>

        {/*  RESULTS GRID */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-yellow-400/10"
                onClick={() => setSelectedMovie(movie)}
              >
                {/* Image Container */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    alt={movie.title}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Rating Badge */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-yellow-400 text-xs font-bold border border-white/10">
                      ★ {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-yellow-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-500">No movies found for this mood.</h2>
            <p className="text-gray-600 mt-2">Try adjusting your filters or searching for something else!</p>
          </div>
        )}

        {/* 5. LOADING / FOOTER */}
        <div className="flex flex-col items-center justify-center mt-16 pb-20">
          {loading ? (
            <FadeLoader color="#FFC509" radius={-5} width={4} />
          ) : hasMore && movies.length > 0 && (
            <button
              onClick={() => setPage(p => p + 1)}
              className="group flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-yellow-400 hover:text-black border border-white/10 hover:border-yellow-400 transition-all duration-300 rounded-full font-bold"
            >
              Show More 🎬
            </button>
          )}
          {!hasMore && movies.length > 0 && (
            <p className="text-gray-500 italic">You've reached the end of the mood board.</p>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default MoodResults
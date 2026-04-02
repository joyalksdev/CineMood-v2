import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { discoverByGenre, searchByMoodKeyword } from '../services/tmbdApi'
import { FadeLoader } from 'react-spinners'
import QuickViewModal from '../components/modals/QuickViewModal'
import moviePlaceholder from "../assets/m-placeholder.png"
import ScrollToTopButton from '../components/ui/ScrollToTopButton'
import GoBackBtn from '../components/ui/GoBackBtn'
import Meta from '../components/ui/Meta'

const MoodResults = () => {
  const { state } = useLocation()
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const moodTitle = state?.mood || 'Custom Selection'

  // reset state when navigation state changes
  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [state])

  // fetch data based on mood keyword or genres
  useEffect(() => {
    if (!state) return
    setLoading(true)

    const handleData = (data) => {
      if (data.length === 0) {
        setHasMore(false)
        return
      }
      setMovies((prev) => {
        // use set to block duplicate movie ids from multiple pages
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

  // infinite scroll logic
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500 && // 500px threshold for smoother loading
        !loading && hasMore
      ) {
        setPage(p => p + 1)
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [loading, hasMore])

  return (
    <div className="relative px-6 text-white min-h-screen pb-20">
      <Meta title={`Vibe: ${moodTitle}`} />
      

      {selectedMovie && (
        <QuickViewModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-16 space-y-4">
          <GoBackBtn />
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-wide italic">
              Vibe: <span className="text-[#FFC509]">{moodTitle}</span>
            </h1>
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">
              Neural matches found for your current state
            </p>
          </div>
        </header>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-10 animate-in fade-in duration-700">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                className="group relative cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#FFC509]/30 transition-all duration-500 shadow-2xl bg-neutral-900">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {movie.vote_average > 0 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[#FFC509] text-[10px] font-black border border-white/10">
                      ★ {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-1 px-1">
                  <h3 className="font-bold text-sm truncate group-hover:text-[#FFC509] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'n/a'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-40 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <h2 className="text-neutral-500 font-black uppercase tracking-widest text-xs">Signal Lost: No movies match this vibe.</h2>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-24">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <FadeLoader color="#FFC509" />
              <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] animate-pulse">Syncing Database</span>
            </div>
          ) : hasMore && movies.length > 0 && (
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-10 py-4 bg-white/5 hover:bg-[#FFC509] hover:text-black border border-white/10 hover:border-[#FFC509] transition-all duration-300 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 shadow-2xl"
            >
              Expand Sector 🎬
            </button>
          )}
          {!hasMore && movies.length > 0 && (
            <p className="text-neutral-700 font-black uppercase text-[10px] tracking-[0.2em] italic">Sector Fully Indexed</p>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default MoodResults
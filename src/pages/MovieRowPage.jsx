import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchPopularAnime,
  fetchPopularMovies,
  fetchPopularKDramas
} from "../services/tmbdApi"
import MovieGridCard from "../components/cards/MovieGridCard"
import { FadeLoader } from "react-spinners"
import { Search, Clapperboard } from "lucide-react"
import GoBackBtn from "../components/ui/GoBackBtn"
import QuickViewModal from "../components/modals/QuickViewModal"
import ScrollToTopButton from "../components/ui/ScrollToTopButton"
import Meta from "../components/ui/Meta"

const API_MAP = {
  now_playing: fetchNowPlayingMovies,
  top_rated: fetchTopRatedMovies,
  trending: fetchTrendingMovies,
  popular_movies: fetchPopularMovies,
  popular_kdrama: fetchPopularKDramas,
  popular_anime: fetchPopularAnime
}

const ROW_TITLES = {
  now_playing: "Now Playing",
  top_rated: "Top Rated",
  trending: "Trending Now",
  popular_movies: "Popular Cinema",
  popular_kdrama: "K-Drama Hits",
  popular_anime: "Top Anime"
}

const MovieRowPage = () => {
  const { type } = useParams()
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    if (!API_MAP[type]) return

    setLoading(true)
    API_MAP[type]().then(data => {
      setMovies(data || [])
      setLoading(false)
    })
  }, [type])

  const filtered = movies.filter(m =>
    (m.title || m.name)?.toLowerCase().includes(search.toLowerCase())
  )

  const pageTitle = ROW_TITLES[type] || "Collection"

  return (
    <div className="min-h-screen bg-transparent px-6 md:px-12 pb-10">
      <Meta title={pageTitle} />
      
      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Header & Search */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <GoBackBtn />
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-[#FFC509]/60 mb-2">
                <Clapperboard size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sector Archive</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
               {pageTitle}
             </h2>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative group w-full md:w-80">
          <Search 
            className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" 
            size={18} 
          />
          <input
            type="text"
            placeholder="Search sector..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-neutral-900/40 border border-white/5 outline-none focus:border-[#FFC509]/30 focus:bg-neutral-900/60 transition-all text-white font-bold placeholder:text-neutral-700 shadow-2xl"
          />
        </div>
      </header>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <FadeLoader color="#FFC509" />
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.5em] animate-pulse">
            Accessing Neural Database
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-1000">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-12">
              {filtered.map(movie => (
                <MovieGridCard 
                  key={movie.id} 
                  movie={movie} 
                  onSelectMovie={setSelectedMovie} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.01]">
              <p className="text-neutral-600 font-black uppercase text-xs tracking-[0.3em]">
                No signals found matching <span className="text-white">"{search}"</span>
              </p>
            </div>
          )}
        </div>
      )}
      
      <ScrollToTopButton />
    </div>
  )
}

export default MovieRowPage
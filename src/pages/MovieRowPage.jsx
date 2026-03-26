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
import { Search, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import GoBackBtn from "../components/ui/GoBackBtn"

const API_MAP = {
  now_playing: fetchNowPlayingMovies,
  top_rated: fetchTopRatedMovies,
  trending: fetchTrendingMovies,
  popular_movies: fetchPopularMovies,
  popular_kdrama: fetchPopularKDramas,
  popular_anime: fetchPopularAnime
}

const ROW_TITLES = {
  now_playing: "Now Playing Movies",
  top_rated: "Top Rated Movies",
  trending: "Trending Movies",
  popular_movies: "Popular Movies",
  popular_kdrama: "Popular K-Dramas",
  popular_anime: "Popular Anime"
}

const MovieRowPage = () => {
  const { type } = useParams()
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen px-6 md:px-12 py-10">
      
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
         <GoBackBtn/>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight ">
            {ROW_TITLES[type] || "Movie Collection"}
          </h2>
          <div className="h-1 w-20 bg-[#FFC509] rounded-full shadow-[0_0_15px_#FFC50960]" />
        </div>

        {/* Neural Search Input */}
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#FFC509] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search within this sector..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[#FFC509]/50 focus:bg-white/[0.08] transition-all text-white font-medium placeholder:text-neutral-600 shadow-2xl"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <FadeLoader color="#FFC509" />
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.5em] animate-pulse">
            Accessing Database
          </p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
              {filtered.map(movie => (
                <MovieGridCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-white/5 rounded-[3rem]">
              <p className="text-neutral-500 font-bold uppercase tracking-widest">
                No signals found matching "{search}"
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MovieRowPage
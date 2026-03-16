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

const API_MAP = {
  now_playing: fetchNowPlayingMovies,
  top_rated: fetchTopRatedMovies,
  trending: fetchTrendingMovies,
  popular_movies: fetchPopularMovies,
  popular_kdrama: fetchPopularKDramas,
  popular_anime: fetchPopularAnime
}

const ROW_TITLES = {
  now_playing: "🎬 Now Playing Movies",
  top_rated: "⭐ Top Rated Movies",
  trending: "🔥 Trending Movies",
  popular_movies: "🎥 Popular Movies",
  popular_kdrama: "🇰🇷 Popular K-Dramas",
  popular_anime: "🍥 Popular Anime"
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
    m.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-6 py-6">
      <h2 className="text-3xl font-bold mb-4">
        {ROW_TITLES[type]}
      </h2>

      <input
        type="text"
        placeholder="Search in this section..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-96 mb-6 p-3 rounded bg-neutral-800 outline-none border border-neutral-700"
      />

      {loading && <FadeLoader color="#FFC509"/>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {!loading && filtered.map(movie => (
          <MovieGridCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default MovieRowPage

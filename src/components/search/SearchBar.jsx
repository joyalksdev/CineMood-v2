import { useState, useEffect, useRef } from "react"
import { searchMovies, searchPeople } from "../../services/tmbdApi"
import { Search, X, Film, User, Calendar, Star } from "lucide-react"
import { Link } from "react-router-dom"
import userPlaceholder from "../../assets/user-placeholder.png"
import moviePlaceholder from "../../assets/m-placeholder.png"

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("")
  const [movieResults, setMovieResults] = useState([])
  const [peopleResults, setPeopleResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const boxRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setMovieResults([])
      setPeopleResults([])
      return
    }

    const delay = setTimeout(() => {
      searchMovies(query).then(d => setMovieResults(d.slice(0, 8)))
      searchPeople(query).then(d => setPeopleResults(d.slice(0, 6)))
    }, 400)

    return () => clearTimeout(delay)
  }, [query])

  useEffect(() => {
    const handler = e => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className={`
      fixed lg:static inset-0 z-50 flex items-start lg:items-center justify-center
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
      bg-black/80 lg:bg-transparent transition-all  duration-500 pt-24 lg:pt-0
    `}>
      
      <button onClick={onClose} className="absolute top-8 right-8 text-neutral-400 hover:text-white lg:hidden">
        <X size={28} />
      </button>

      {/* FIXED CONTAINER: Added 'bg-transparent' and removed any implicit padding or borders */}
      <div ref={boxRef} className="relative w-[90%] lg:w-full max-w-md bg-transparent">
        
        {/* Input Field (Now with refined backdrop-blur-3xl and bg-white/[0.03]) */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#FFC509] transition-colors" size={18} />
          
          <input
            autoFocus
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            placeholder="Search movies or actors..."
            className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl outline-none focus:border-[#FFC509]/40 focus:bg-white/[0.07] transition-all text-sm text-white placeholder:text-neutral-500 shadow-2xl"
          />

          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Dropdown (Scrollable, High Visibility) */}
        {showResults && query.length > 0 && (
          <div className="absolute mt-3 w-full max-h-[70vh] overflow-y-auto bg-stone-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] z-50 custom-scrollbar animate-in fade-in slide-in-from-top-4 duration-300">
            
            {/* Movies Section */}
            {movieResults.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-[#FFC509]/60 uppercase tracking-[0.2em]">
                  <Film size={12} /> Movies
                </div>
                {movieResults.map(movie => (
                  <Link
                    to={`/movie/${movie.id}`}
                    key={movie.id}
                    onClick={() => { setQuery(""); setShowResults(false); onClose(); }}
                    className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : moviePlaceholder}
                      className="w-10 h-14 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-[#FFC509] transition-colors truncate">{movie.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Calendar size={11} /> {movie.release_date?.slice(0,4)}
                        </span>
                        {/* Fixed Visibility Rating */}
                        <span className="text-xs text-[#FFC509] font-bold flex items-center gap-1">
                          <Star size={11} fill="#FFC509" /> {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* People Section */}
            {peopleResults.length > 0 && (
              <div className="p-2 border-t border-white/5">
                <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-[#FFC509]/60 uppercase tracking-[0.2em]">
                  <User size={12} /> Cast & Crew
                </div>
                {peopleResults.map(person => (
                  <Link
                    to={`/person/${person.id}`}
                    key={person.id}
                    onClick={() => { setQuery(""); setShowResults(false); onClose(); }}
                    className="flex items-center gap-4 px-3 py-2 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <img
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w92${person.profile_path}` : userPlaceholder}
                      className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-[#FFC509]/50 transition-all"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-[#FFC509] transition-colors">{person.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{person.known_for_department}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
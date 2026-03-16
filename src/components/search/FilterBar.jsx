import { useEffect, useRef, useState } from "react"
import { HiChevronDown } from "react-icons/hi"

const GENRES = [
  { id: "", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "35", name: "Comedy" },
  { id: "12", name: "Adventure" },
  { id: "878", name: "Sci-Fi" },
  { id: "18", name: "Drama" },
  { id: "10749", name: "Romance" },
]

const LANGUAGES = [
  { id: "", name: "All Languages" },
  { id: "en", name: "English" },
  { id: "ml", name: "Malayalam" },
  { id: "hi", name: "Hindi" },
  { id: "ta", name: "Tamil" },
  { id: "te", name: "Telugu" },
]

const SORTS = [
  { id: "rating", name: "Top Rated" },
  { id: "new", name: "Latest" },
  { id: "old", name: "Oldest" }
]

const FilterBar = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
    setOpen(null)
  }

  return (
    <div ref={dropdownRef} className="flex flex-wrap gap-3 relative">
      
      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "sort" ? null : "sort")}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all text-sm font-medium text-white backdrop-blur-md"
        >
          {SORTS.find(s => s.id === filters.sort)?.name || "Sort"}
          <HiChevronDown className={`transition-transform duration-300 ${open === 'sort' ? 'rotate-180' : ''}`} />
        </button>

        {open === "sort" && (
          <div className="absolute left-0 mt-2 w-40 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {SORTS.map(s => (
              <div
                key={s.id}
                onClick={() => updateFilter("sort", s.id)}
                className="px-4 py-2 text-sm text-neutral-300 hover:bg-[#FFC509] hover:text-black cursor-pointer transition-colors"
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Genre Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "genre" ? null : "genre")}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all text-sm font-medium text-white backdrop-blur-md"
        >
          {GENRES.find(g => g.id === filters.genre)?.name || "Genres"}
          <HiChevronDown className={`transition-transform duration-300 ${open === 'genre' ? 'rotate-180' : ''}`} />
        </button>

        {open === "genre" && (
          <div className="absolute left-0 mt-2 w-44 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {GENRES.map(g => (
              <div
                key={g.id}
                onClick={() => updateFilter("genre", g.id)}
                className="px-4 py-2 text-sm text-neutral-300 hover:bg-[#FFC509] hover:text-black cursor-pointer transition-colors"
              >
                {g.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "lang" ? null : "lang")}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all text-sm font-medium text-white backdrop-blur-md"
        >
          {LANGUAGES.find(l => l.id === filters.language)?.name || "Languages"}
          <HiChevronDown className={`transition-transform duration-300 ${open === 'lang' ? 'rotate-180' : ''}`} />
        </button>

        {open === "lang" && (
          <div className="absolute left-0 mt-2 w-44 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {LANGUAGES.map(l => (
              <div
                key={l.id}
                onClick={() => updateFilter("language", l.id)}
                className="px-4 py-2 text-sm text-neutral-300 hover:bg-[#FFC509] hover:text-black cursor-pointer transition-colors"
              >
                {l.name}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default FilterBar
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import userPlaceholder from "../assets/user-placeholder.png"
import { fetchPersonDetails } from '../services/tmbdApi'
import { FadeLoader } from 'react-spinners'
import QuickViewModal from '../components/modals/QuickViewModal'
import MovieGridCard from '../components/cards/MovieGridCard'
import GoBackBtn from '../components/ui/GoBackBtn'
import Meta from '../components/ui/Meta'
import ScrollToTopButton from '../components/ui/ScrollToTopButton'

const PersonDetails = () => {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [castMovies, setCastMovies] = useState([])
  const [displayLimit, setDisplayLimit] = useState(12) // Infinite scroll logic
  const [selectedMovie, setSelectedMovie] = useState(null)
  const loaderRef = useRef(null)

  useEffect(() => {
    fetchPersonDetails(id).then((data) => {
      setPerson(data)
      // Sort movies by popularity so their best work shows first
      const sortedCast = data.movie_credits.cast.sort((a, b) => b.popularity - a.popularity)
      setCastMovies(sortedCast)
    })
  }, [id])

  // Infinite Scroll Observer for the filmography
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && person) {
        setDisplayLimit((prev) => prev + 12)
      }
    }, { threshold: 0.1 })

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [person])

  if (!person) return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <FadeLoader color="#FFC509" />
    </div>
  )

  const visibleMovies = castMovies.slice(0, displayLimit)

  return (
    <div className="min-h-screen bg-black text-white pb-20 px-4 md:px-10">
      <Meta title={person.name} />
      
      {selectedMovie && (
        <QuickViewModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <div className='py-6'>
        <GoBackBtn />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Profile Header Area */}
        <header className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-20">
          <div className="relative shrink-0">
            <img
              src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : userPlaceholder}
              className="w-64 h-80 md:w-72 md:h-96 object-cover rounded-3xl shadow-2xl border border-white/10"
              alt={person.name}
            />
            <div className="absolute -bottom-4 -right-4 bg-[#FFC509] text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg">
              {person.known_for_department}
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              {person.name}
            </h1>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-600">Born</span>
                <span className="text-neutral-300">{person.birthday || "Unknown"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-600">Origin</span>
                <span className="text-neutral-300 truncate max-w-[200px]">{person.place_of_birth || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-600">Influence</span>
                <span className="text-[#FFC509]">{Math.round(person.popularity)} pts</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FFC509]">Biography</h3>
              <p className="text-neutral-400 leading-relaxed max-w-3xl text-sm md:text-base font-medium">
                {person.biography || "No biological data found in the neural archives."}
              </p>
            </div>
          </div>
        </header>

        {/* Filmography Section */}
        <section className="mt-20">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Known For</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
            {visibleMovies.map((movie) => (
              <MovieGridCard 
                key={movie.id} 
                movie={movie} 
                onSelectMovie={setSelectedMovie} 
              />
            ))}
          </div>

          {/* Loader for Infinite Scroll */}
          {displayLimit < castMovies.length && (
            <div ref={loaderRef} className="flex justify-center py-20">
              <FadeLoader color="#FFC509" />
            </div>
          )}

          {displayLimit >= castMovies.length && castMovies.length > 0 && (
            <div className="text-center py-20 opacity-20">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white">Archives Complete</span>
            </div>
          )}
        </section>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default PersonDetails
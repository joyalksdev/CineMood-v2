import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userPlaceholder from "../assets/user-placeholder.png"
import moviePlaceholder from "../assets/m-placeholder.png"
import { fetchPersonDetails } from '../services/tmbdApi'
import { FadeLoader } from 'react-spinners'
import QuickViewModal from '../components/modals/QuickViewModal'
import GoBackBtn from '../components/ui/GoBackBtn'

const PersonDetails = () => {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchPersonDetails(id).then(setPerson)
  }, [id])

   useEffect(() => {
    setSelectedMovie(null)
  }, [id])
  

  if (!person) return <div className='p-6 '>
<FadeLoader
      className='mx-auto mb-5'
  color="#FFC509"
  radius={-5}
  speedMultiplier={1}
  width={4}
  loading />
</div>

return (
  <div className="min-h-screen bg-gradient-to-b rounded-2xl from-neutral-950 via-neutral-900 to-black text-white pb-16 px-6">
     
     <div className='p-2'>
      <GoBackBtn />
     </div>

    <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">

      <header className="flex flex-col md:flex-row gap-10 items-center md:items-start">


        <div className="relative">
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : userPlaceholder
            }
            className="w-52 h-72 object-cover rounded-2xl shadow-xl"
          />
          <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-3 py-1 rounded-full">
            {person.known_for_department}
          </span>
        </div>


        <div className="flex-1">
          <h2 className="text-4xl font-bold leading-tight">
            {person.name}
          </h2>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mt-3">
            <span>🎂 {person.birthday || "N/A"}</span>
            <span>📍 {person.place_of_birth || "Unknown"}</span>
            <span>🔥 Popularity: {Math.round(person.popularity)}</span>
          </div>

          <p className="text-neutral-300 mt-6 leading-relaxed max-w-2xl line-clamp-6">
            {person.biography || "Biography not available."}
          </p>
        </div>
      </header>


      <div className="border-t border-white/10 my-10"></div>

      <section>
        <h3 className="text-2xl font-semibold mb-6">Known For</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {person.movie_credits.cast.slice(0, 10).map(movie => (
            <div key={movie.id} className="group cursor-pointer" onClick={() => navigate(`/movie/${movie.id}`)}>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : moviePlaceholder}
                className="rounded-xl group-hover:scale-105 transition"
              />
              <p className="text-sm mt-2 opacity-80 truncate">
                {movie.title || movie.name}
              </p>
            </div>
          ))}
        </div>
       
      </section>

    </div>
  </div>
)

}

export default PersonDetails
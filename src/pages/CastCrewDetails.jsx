import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchMovieCredits, fetchMovieDetails } from "../services/tmbdApi"
import userPlaceholder from "../assets/user-placeholder.png"
import GoBackBtn from '../components/ui/GoBackBtn'
import { FadeLoader } from "react-spinners"

const CastCrewDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [credits, setCredits] = useState(null)
  const [movie, setMovie] = useState(null)
  

  useEffect(() => {
    fetchMovieCredits(id).then(setCredits)
    fetchMovieDetails(id).then(setMovie)
  }, [id])



  if (!credits || !movie) return <div className='p-6 '>
  <FadeLoader
        className='mx-auto mb-5'
    color="#FFC509"
    radius={-5}
    speedMultiplier={1}
    width={4}
    loading />
  </div>

  return (
    <div className="px-8 py-3 text-white">

      <GoBackBtn />

      <h2 className="text-3xl font-bold mb-1">{movie.title}</h2>
      <p className="text-neutral-400 mb-6">Full Cast & Crew</p>

   
      <section>
        <h3 className="text-xl font-semibold mb-3">Cast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {credits.cast.map(person => (
            <div
              key={person.id}
              onClick={() => navigate(`/person/${person.id}`)}
              className="cursor-pointer text-center hover:scale-105 transition"
            >
              <img
                src={person.profile_path
                  ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                  : userPlaceholder}
                className="rounded-full aspect-square object-cover mx-auto"
              />
              <p className="mt-2 text-sm">{person.name}</p>
              <p className="text-xs text-neutral-400">{person.character}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Crew</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {credits.crew.map(person => (
            <div
              key={`${person.id}-${person.job}`}
              onClick={() => navigate(`/person/${person.id}`)}
              className="bg-neutral-900 p-3 rounded-lg hover:bg-neutral-800 cursor-pointer transition"
            >
              <p className="font-medium">{person.name}</p>
              <p className="text-xs text-neutral-400">{person.job}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default CastCrewDetails

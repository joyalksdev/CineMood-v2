import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import mPlaceholder from "../../assets/m-placeholder.png"

const MovieGridCard = ({ movie }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="cursor-pointer group"
    >
      <div className="relative rounded-xl overflow-hidden bg-neutral-900 shadow-lg">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : mPlaceholder
          }
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />

       
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">
            {movie.title}
          </h3>

          <div className="flex justify-between items-center mt-1 text-xs text-neutral-300">
            <span>{movie.release_date?.slice(0, 4)}</span>
            {movie.vote_average && (
              <span className="text-[#FFC509]">⭐ {movie.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MovieGridCard

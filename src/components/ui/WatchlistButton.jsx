import { motion, AnimatePresence } from "framer-motion"
import { GoPlus } from "react-icons/go"
import { IoCheckmark } from "react-icons/io5"
import { useWatchlist } from "../../context/WatchlistContext"

const sizes = {
  card: "w-9 h-9 text-xl",
  modal: "w-12 h-12 text-2xl",
  details: "w-9 h-9 text-3xl"
}

const WatchlistButton = ({ movie, variant = "card" }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const exists = watchlist.some(m => m.id === movie.id)

  const handleClick = () => {
    exists ? removeFromWatchlist(movie.id) : addToWatchlist(movie)
  }

  return (
    <div className="relative group">
      {/* Tooltip */}
      <span
        className="absolute -top-9 left-1/2 -translate-x-1/2 scale-0 
        group-hover:scale-100 transition-all duration-200
        whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg"
      >
        {exists ? "Remove from Watchlist" : "Add to Watchlist"}
      </span>

      {/* Button */}
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.85 }}
        className={`flex items-center justify-center rounded-full transition-all duration-300
        ${sizes[variant]}
        ${exists 
          ? "bg-green-500 text-black" 
          : "bg-[#FFC509] text-black hover:scale-110"
        }`}
      >
        <AnimatePresence mode="wait">
          {exists ? (
            <motion.span
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <IoCheckmark />
            </motion.span>
          ) : (
            <motion.span
              key="plus"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
            >
              <GoPlus />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export default WatchlistButton

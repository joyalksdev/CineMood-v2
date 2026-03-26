import { motion, AnimatePresence } from "framer-motion"
import { GoPlus } from "react-icons/go"
import { IoCheckmark } from "react-icons/io5"
import { useWatchlist } from "../../context/WatchlistContext"
import Tooltip from "../ui/Tooltip" // Using your custom tooltip

const sizes = {
  card: "w-10 h-10 text-xl", // Increased slightly to match our new h-10 Info buttons
  modal: "w-12 h-12 text-2xl",
  details: "w-14 h-14 text-3xl"
}

const WatchlistButton = ({ movie, variant = "card" }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const exists = watchlist.some(m => m.id === movie.id)

  const handleClick = (e) => {
    e.stopPropagation()
    if (exists) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  return (
    <Tooltip text={exists ? "Remove from Watchlist" : "Add to Watchlist"}>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        // Using layout to smooth transition between icons
        layout
        className={`flex items-center justify-center rounded-xl transition-all duration-300 shadow-xl
        ${sizes[variant]}
        ${exists 
          ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] border-none" 
          : "bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-yellow-400 hover:text-black hover:border-white"
        }`}
      >
        <AnimatePresence mode="wait">
          {exists ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IoCheckmark />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <GoPlus />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </Tooltip>
  )
}

export default WatchlistButton
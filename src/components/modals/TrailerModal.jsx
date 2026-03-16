import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const TrailerModal = ({ videoKey, onClose }) => {
  const ref = useRef()

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={ref}
          className="w-[90%] max-w-4xl bg-black rounded-xl overflow-hidden"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
        >
          <iframe
            className="w-full aspect-video"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TrailerModal

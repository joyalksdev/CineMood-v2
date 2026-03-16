import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-block overflow-visible"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-[9999]
                       whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg pointer-events-none"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}

export default Tooltip

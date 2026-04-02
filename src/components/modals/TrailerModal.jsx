import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TrailerModal: A lightweight video player overlay for YouTube trailers.
 * Uses Framer Motion for smooth scaling and fade transitions.
 */
const TrailerModal = ({ videoKey, onClose }) => {
  const ref = useRef();

  // Close the modal if the user clicks anywhere outside the video container
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* Full-screen darkened overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Video container with "pop-in" scale animation */}
        <motion.div
          ref={ref}
          className="w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* YouTube Embed Iframe:
            - aspect-video ensures 16:9 ratio automatically
            - autoplay=1 starts the trailer immediately on load
          */}
          <iframe
            className="w-full aspect-video"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
            title="Movie Trailer"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrailerModal;
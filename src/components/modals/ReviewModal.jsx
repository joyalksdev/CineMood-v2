import { useState } from "react";
import { X, MessageSquareQuote, Send, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { addReview } from "../../services/reviewService";
import { motion, AnimatePresence } from "framer-motion";

const ReviewModal = ({ movie, onClose }) => {
  const [rating, setRating] = useState(5); // Default to middle
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (text.trim().length < 5) return toast.error("Tell us a bit more about the vibe!");
    
    try {
      setLoading(true);
      await addReview({
        movieId: movie.id.toString(),
        movieTitle: movie.title, 
        rating: Number(rating),
        content: text.trim()
      });

      toast.success(`Review for ${movie.title} published! 🎬`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      // INCREASED Z-INDEX TO 150 TO OVERLAY QUICKVIEW
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-[150] p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#0f0f0f] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Header with Backdrop */}
        <div className="relative h-32 w-full overflow-hidden">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-white/10 rounded-full transition-colors z-20">
            <X size={20} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-8">
             <h2 className="text-2xl font-bold text-white tracking-tight italic">Reviewing {movie.title}</h2>
          </div>
        </div>

        <div className="p-8">
          {/* Vibe Slider Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative flex items-center justify-center mb-6">
              <span className="text-6xl font-black text-[#FFC509] drop-shadow-[0_0_15px_rgba(255,197,9,0.4)]">
                {rating}
              </span>
              <span className="text-xl font-bold text-neutral-600 ml-2 mt-4">/ 10</span>
            </div>

            <div className="w-full px-4 relative">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFC509] transition-all"
                style={{
                  background: `linear-gradient(to right, #FFC509 0%, #FFC509 ${(rating - 1) * 11.11}%, #1f1f1f ${(rating - 1) * 11.11}%, #1f1f1f 100%)`
                }}
              />
              <div className="flex justify-between mt-3 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num} className={`text-[10px] font-bold ${rating == num ? 'text-[#FFC509]' : 'text-neutral-700'}`}>
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Review Input */}
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What made this a vibe for you?"
              className="w-full h-36 bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-5 text-sm text-neutral-200 resize-none focus:outline-none focus:border-[#FFC509]/30 transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={onClose} className="text-sm font-semibold text-neutral-500 hover:text-white transition-colors">
              Maybe later
            </button>

            <button
              disabled={loading}
              onClick={submitReview}
              className="group flex items-center gap-2 bg-[#FFC509] text-black px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-30 shadow-[0_10px_20px_rgba(255,197,9,0.15)]"
            >
              {loading ? "Publishing..." : "Publish Review"}
              {!loading && <Send size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewModal;
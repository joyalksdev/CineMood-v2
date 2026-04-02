import { useState } from "react";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { reportReview } from "../../services/reviewService";

const ReportModal = ({ review, onClose }) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // pre-set report reasons
  const reasons = ["Spam", "Inappropriate Language", "Spoilers", "Other"];

  const handleReport = async () => {
    // validation check before hitting the api
    if (!reason) return toast.error("Please select a reason");

    setSubmitting(true);
    try {
      // sends report using either mongo id or tmdb id
      await reportReview(review._id || review.id, reason);

      toast.success("Review reported for moderation 🛡️");
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to submit report";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // dark blurred overlay with fade animation
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex justify-center items-center z-[150] p-4"
    >
      {/* modal card with scaling effect */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-[#0f0f0f] w-full max-w-sm rounded-[2rem] border border-white/10 p-8 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
            <ShieldAlert size={24} />
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Report Review</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Is there something wrong with the review by{" "}
          <span className="text-white">
            @{review.username || review.author}
          </span>
          ?
        </p>

        {/* clickable reason buttons list */}
        <div className="space-y-2 mb-8">
          {reasons.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                reason === r
                  ? "bg-red-500/10 border-red-500/50 text-red-500"
                  : "bg-white/5 border-white/5 text-neutral-400 hover:border-white/20"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* main submit action button */}
        <button
          disabled={submitting}
          onClick={handleReport}
          className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ReportModal;
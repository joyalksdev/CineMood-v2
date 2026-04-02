import React, { useEffect, useState } from "react";
import {
  Trash2,
  Film,
  Star,
  MessageSquare,
  RefreshCcw,
  Search,
  ExternalLink,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// components
import Tooltip from "../../components/ui/Tooltip";
import DeleteModal from "../../components/modals/DeleteModal";
import InfoTooltip from "../../components/ui/InfoTooltip";
import FullReviewModal from "../../components/modals/FullReviewModal";

// service imports
import { deleteReview, dismissReviewFlags, getAllReviews } from "../../services/adminService";

const AdminReviewList = () => {
  const navigate = useNavigate();
  // state for reviews and UI
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // modal states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // fetch reviews from database
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data || []);
    } catch (err) {
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // initial data load
  useEffect(() => {
    fetchReviews();
  }, []);

  // clear flags on safe reviews
  const handleDismiss = async (id) => {
    try {
      await dismissReviewFlags(id);
      toast.success("Reports cleared");
      // update local state
      setReviews((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isFlagged: false, reportCount: 0 } : r
        )
      );
    } catch (err) {
      toast.error("Failed to clear reports");
    }
  };

  // delete review handler
  const confirmDelete = async () => {
    if (!selectedReview?._id) return;
    setIsDeleting(true);
    try {
      await deleteReview(selectedReview._id);
      toast.success("Review deleted successfully");
      // filter out deleted item
      setReviews((prev) => prev.filter((r) => r._id !== selectedReview._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Could not delete review");
    } finally {
      setIsDeleting(false);
      setSelectedReview(null);
    }
  };

  // filter reviews by search term
  const filteredReviews = (reviews || []).filter(
    (rev) =>
      rev.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.movieName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.movieId?.toString().includes(searchTerm)
  );

  // open preview modal
  const handleOpenPreview = (review) => {
    setSelectedReview(review);
    setIsPreviewModalOpen(true);
  };

  // open delete confirmation
  const handleOpenDelete = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white animate-in fade-in duration-700">
      
      {/* header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              User <span className="text-[#FFC509]">Reviews</span>
            </h1>
            <InfoTooltip
              title="Review Insights"
              content="Monitor user feedback and manage reported content. Use search to find specific reviews by user or movie."
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
            Manage platform community feedback
          </p>
        </div>

        {/* search and controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
            <input
              type="text"
              placeholder="Search user, movie, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/5 focus:border-[#FFC509]/30 outline-none transition-all text-sm placeholder:text-neutral-700"
            />
          </div>
          <Tooltip text="Refresh List">
            <button
              onClick={fetchReviews}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-[#FFC509] transition-all flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* grid content */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-[#FFC509]/20 border-t-[#FFC509] rounded-full animate-spin" />
          <p className="text-xs font-medium text-neutral-600">Syncing database...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-20 text-center bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <MessageSquare className="mx-auto text-neutral-800 mb-4" size={48} />
          <p className="text-neutral-500 text-sm font-medium">No results found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev._id}
              className={`group bg-[#0A0A0A] border rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${
                rev.isFlagged
                  ? "border-red-500/40 bg-red-500/[0.02]"
                  : rev.reportCount > 0
                  ? "border-orange-500/30"
                  : "border-white/5 hover:border-[#FFC509]/30"
              }`}
            >
              {/* movie link */}
              <div 
                onClick={() => navigate(`/movie/${rev.movieId}`)}
                className="mb-5 flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#FFC509]/40 hover:bg-[#FFC509]/[0.02] transition-all cursor-pointer group/movie"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Film size={14} className="text-[#FFC509] shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 truncate">
                    {rev.movieName || `Movie ID: ${rev.movieId}`}
                  </span>
                </div>
                <ExternalLink size={12} className="text-neutral-600 group-hover/movie:text-[#FFC509] transition-colors" />
              </div>

              {/* user details */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-[#FFC509] font-bold">
                    {rev.userName?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 truncate">
                      {rev.userName}
                      {rev.userId?.status === "banned" && (
                        <span className="text-[8px] bg-red-500/20 text-red-500 border border-red-500/30 px-1.5 py-0.5 rounded uppercase font-black shrink-0">
                          Banned
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-neutral-600 truncate block max-w-[140px]">
                      {rev.userId?.email || <span className="text-red-400/50 italic text-[9px]">Deleted User</span>}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/5 text-[11px] font-bold text-white">
                  <Star size={10} className="text-[#FFC509] fill-[#FFC509]" /> {rev.rating}
                </div>
              </div>

              {/* text preview */}
              <div 
                onClick={() => handleOpenPreview(rev)}
                className="cursor-pointer bg-white/[0.01] p-4 rounded-2xl border border-white/5 mb-6 hover:bg-white/[0.03] hover:border-white/10 transition-all group/content"
              >
                <p className="text-neutral-400 text-xs leading-relaxed italic line-clamp-3">
                  "{rev.content}"
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[#FFC509] text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/content:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                  <Eye size={10} /> View Full Detail
                </div>
              </div>

              {/* footer actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-600 font-bold uppercase">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex gap-2">
                  {(rev.reportCount > 0 || rev.isFlagged) && (
                    <button
                      onClick={() => handleDismiss(rev._id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase"
                    >
                      Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenDelete(rev)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/5 text-red-500/70 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal rendering */}
      {isPreviewModalOpen && (
        <FullReviewModal
          review={selectedReview}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Review?"
        message="This will permanently remove the review from CineMood. This action cannot be undone."
      />
    </div>
  );
};

export default AdminReviewList;
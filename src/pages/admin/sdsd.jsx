import React, { useEffect, useState } from "react";
import { 
  Trash2, Star, MessageSquare, RefreshCcw, 
  Search, ExternalLink, Eye, 
  Film
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this
import { toast } from "react-hot-toast";
import api from "../../services/axios";
import Tooltip from "../../components/ui/Tooltip";
import DeleteModal from "../../components/modals/DeleteModal";
import InfoTooltip from "../../components/ui/InfoTooltip";
import FullReviewModal from "../../components/modals/FullReviewModal"; // Import your new modal

const AdminReviewList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/reviews");
      const dataArray = Array.isArray(response.data) ? response.data : response.data.reviews;
      setReviews(dataArray || []);
    } catch (err) {
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

    const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/reviews/${selectedReviewId}`);
      toast.success("Review deleted successfully");
      setReviews(reviews.filter((r) => r._id !== selectedReviewId));
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Could not delete review");
    } finally {
      setIsDeleting(false);
      setSelectedReviewId(null);
    }
  };

    const handleDismiss = async (id) => {
    try {
      await api.put(`/reviews/${id}/dismiss`);
      toast.success("Reports cleared");
      setReviews(
        reviews.map((r) =>
          r._id === id ? { ...r, isFlagged: false, reportCount: 0 } : r,
        ),
      );
    } catch (err) {
      toast.error("Failed to clear reports");
    }
  };



  useEffect(() => { fetchReviews(); }, []);

  // --- Search Logic ---
  const filteredReviews = reviews.filter(rev => 
    rev.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.movieName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenPreview = (review) => {
    setSelectedReview(review);
    setIsPreviewModalOpen(true);
  };

  const handleOpenDelete = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white animate-in fade-in duration-700">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              User <span className="text-[#FFC509]">Reviews</span>
            </h1>
            <InfoTooltip title="Review Insights" content="..." />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
            <input 
              type="text"
              placeholder="Search user, content, or movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/5 focus:border-[#FFC509]/30 outline-none transition-all text-sm"
            />
          </div>
          <button onClick={fetchReviews} className="...">
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Grid of Reviews */}
      {loading ? (
        <div className="py-40 flex flex-col items-center">...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-20 text-center">No reviews found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div key={rev._id} className="...">
              
              {/* Movie Header Link */}
              <div 
                onClick={() => navigate(`/movie/${rev.movieId}`)}
                className="mb-4 flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#FFC509]/50 transition-all cursor-pointer group/movie"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Film size={14} className="text-[#FFC509]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 truncate">
                    {rev.movieName || `ID: ${rev.movieId}`}
                  </span>
                </div>
                <ExternalLink size={12} className="text-neutral-600 group-hover/movie:text-[#FFC509]" />
              </div>

              {/* User Info (Same as yours) */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-[#FFC509] font-bold">
                    {rev.userName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.userName}</h4>
                    <span className="text-[10px] text-neutral-600">{rev.userId?.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/5 text-[11px] font-bold">
                  <Star size={10} className="text-[#FFC509] fill-[#FFC509]" /> {rev.rating}
                </div>
              </div>

              {/* Preview Content */}
              <div 
                onClick={() => handleOpenPreview(rev)}
                className="cursor-pointer bg-white/[0.01] p-4 rounded-2xl border border-white/5 mb-6 hover:bg-white/[0.03] transition-colors group/text"
              >
                <p className="text-neutral-400 text-xs leading-relaxed italic line-clamp-3">
                  "{rev.content}"
                </p>
                <div className="mt-2 flex items-center gap-1 text-[#FFC509] text-[9px] font-bold opacity-0 group-hover/text:opacity-100 transition-opacity">
                  <Eye size={10} /> READ FULL REVIEW
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] text-neutral-600 font-bold uppercase">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
                <button onClick={() => handleOpenDelete(rev)} className="...">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <FullReviewModal 
        review={selectedReview} 
        onClose={() => setIsPreviewModalOpen(false)} 
        isOpen={isPreviewModalOpen} // Pass an isOpen prop if your modal needs it
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete} // You'll need to update confirmDelete to use selectedReview._id
        loading={isDeleting}
        title="Delete Review?"
        message="This action is permanent."
      />
    </div>
  );
};

export default AdminReviewList
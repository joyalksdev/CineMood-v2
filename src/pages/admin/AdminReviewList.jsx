import React, { useEffect, useState } from "react";
import { Trash2, Film, Star, MessageSquare, RefreshCcw, Mail, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/axios";
import Tooltip from "../../components/ui/Tooltip";
import DeleteModal from "../../components/modals/DeleteModal"; 
// Added the new InfoTooltip import
import InfoTooltip from "../../components/ui/InfoTooltip"; 

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedReviewId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/reviews/${selectedReviewId}`);
      toast.success("Review deleted successfully");
      setReviews(reviews.filter(r => r._id !== selectedReviewId));
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Could not delete review");
    } finally {
      setIsDeleting(false);
      setSelectedReviewId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              User <span className="text-[#FFC509]">Reviews</span>
            </h1>
            {/* Added InfoTooltip here */}
            <InfoTooltip 
              title="Review Insights"
              content="This section displays all movie reviews submitted by users. You can monitor ratings, check for inappropriate content, and remove reviews that violate community guidelines."
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
            Manage feedback from your users
          </p>
        </div>

        <Tooltip text="Refresh List">
          <button 
            onClick={fetchReviews}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-[#FFC509] transition-all flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Sync Data
          </button>
        </Tooltip>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-[#FFC509]/20 border-t-[#FFC509] rounded-full animate-spin" />
          <p className="text-xs font-medium text-neutral-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <MessageSquare className="mx-auto text-neutral-800 mb-4" size={48} />
          <p className="text-neutral-500 text-sm font-medium">No reviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev._id} className="group bg-[#0A0A0A] border border-white/5 hover:border-[#FFC509]/30 rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-[#FFC509] font-bold">
                      {rev.userName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFC509] transition-colors truncate">
                        {rev.userName}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-600 font-medium">
                        <Mail size={10} />
                        <span className="truncate">{rev.userId?.email || "Guest User"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 shrink-0">
                    <Star size={10} className="text-[#FFC509] fill-[#FFC509]" />
                    <span className="text-[11px] font-bold text-white">{rev.rating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    <Film size={12} className="text-neutral-700" /> 
                    Movie ID: <span className="text-neutral-400">{rev.movieId}</span>
                  </div>
                  <div className="bg-white/[0.01] p-4 rounded-2xl border border-white/5 relative">
                    <p className="text-neutral-400 text-xs leading-relaxed font-medium italic">
                      "{rev.content}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-1 text-[10px] text-neutral-600 font-bold">
                  <Calendar size={12} className="opacity-50" />
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
                
                <Tooltip text="Delete Review">
                  <button 
                    onClick={() => openDeleteModal(rev._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 text-red-500/70 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteModal 
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Review?"
        message="You are about to remove this review permanently. This cannot be reversed."
      />
    </div>
  );
};

export default AdminReviewList;
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

  const handleDismiss = async (id) => {
  try {
    await api.put(`/reviews/${id}/dismiss`);
    toast.success("Reports cleared");
    // Update local state so the red/orange UI disappears immediately
    setReviews(reviews.map(r => r._id === id ? { ...r, isFlagged: false, reportCount: 0 } : r));
  } catch (err) {
    toast.error("Failed to clear reports");
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
           <div key={rev._id} className={`group bg-[#0A0A0A] border rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${
              rev.isFlagged ? "border-red-500/40 bg-red-500/[0.02]" : rev.reportCount > 0 ? "border-orange-500/30" : "border-white/5 hover:border-[#FFC509]/30"
            }`}>
              
              {/* Top Section: User Info + Status Badges */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-[#FFC509] font-bold">
                    {rev.userName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.userName}</h4>
                    <span className="text-[10px] text-neutral-600 truncate block max-w-[120px]">{rev.userId?.email || "Guest"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rev.isFlagged && <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-2 py-1 rounded-md border border-red-500/20 uppercase">Flagged</span>}
                  {rev.reportCount > 0 && <span className="bg-orange-500/10 text-orange-500 text-[9px] font-black px-2 py-1 rounded-md border border-orange-500/20 uppercase">{rev.reportCount} Reports</span>}
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/5 text-[11px] font-bold text-white">
                    <Star size={10} className="text-[#FFC509] fill-[#FFC509]" /> {rev.rating}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white/[0.01] p-4 rounded-2xl border border-white/5 mb-6">
                <p className="text-neutral-400 text-xs leading-relaxed italic">"{rev.content}"</p>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] text-neutral-600 font-bold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                
                <div className="flex gap-2">
                  {/* DISMISS BUTTON: Only shows if there are reports */}
                  {(rev.reportCount > 0 || rev.isFlagged) && (
                    <button 
                      onClick={() => handleDismiss(rev._id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase"
                    >
                      Check & Approve
                    </button>
                  )}
                  
                  <button 
                    onClick={() => openDeleteModal(rev._id)}
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
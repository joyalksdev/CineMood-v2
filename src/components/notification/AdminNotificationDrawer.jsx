import React, { useState } from "react";
import { X, BellOff, ShieldAlert, MessageSquare, Trash2, Edit3, Check, RefreshCw, Zap, Activity, Info, Construction } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import DeleteModal from "../modals/DeleteModal";

const AdminNotificationDrawer = ({ isOpen, onClose, notifications, onDelete, onUpdate, fetchNotifications }) => {
  // prevents scrolling the background when drawer is open
  useLockBodyScroll(isOpen);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", message: "", type: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  // re-fetches notifications from the server
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // populates the form with existing data to start editing
  const startEditing = (n) => {
    setEditingId(n._id);
    setEditForm({ title: n.title, message: n.message, type: n.type });
  };

  // sends the updated data to the backend
  const handleSave = async (id) => {
    await onUpdate(id, editForm);
    setEditingId(null);
  };

  // handles the final deletion after user confirms
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // determines icons and colors based on notification category
  const getCategoryStyles = (type) => {
    switch (type) {
      case "system":
        return { icon: ShieldAlert, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "System" };
      case "maintenance":
        return { icon: Construction, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Maintenance" };
      case "warning":
        return { icon: Activity, color: "text-[#FFC509]", bg: "bg-[#FFC509]/10", border: "border-[#FFC509]/20", label: "Warning" };
      case "alert":
        return { icon: Zap, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", label: "Urgent" };
      default:
        return { icon: Info, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "General" };
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
      {/* clickable backdrop to close */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-[#080808] border-l border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
        
        {/* sub-modal for delete confirmation */}
        <DeleteModal 
          isOpen={!!deleteConfirmId}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
          loading={isDeleting}
          title="Delete Notification?"
          message="This notification will be permanently removed from all user feeds."
        />

        {/* drawer header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Notifications</h3>
            <p className="text-[10px] text-neutral-600 mt-0.5 font-medium">Manage sent alerts</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-2.5 hover:bg-white/5 rounded-xl text-neutral-500 hover:text-[#FFC509] transition-all">
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-xl text-neutral-500 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* scrollable list of notifications */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const styles = getCategoryStyles(n.type);
              const CategoryIcon = styles.icon;

              return (
                <div 
                  key={n._id} 
                  className={`p-5 rounded-[2rem] border transition-all bg-black/40 ${
                    editingId === n._id ? 'border-[#FFC509]/40 bg-[#FFC509]/5' : styles.border
                  }`}
                >
                  {/* render edit form if this item is being edited */}
                  {editingId === n._id ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#FFC509] uppercase tracking-wider">Edit Message</span>
                        <select 
                          value={editForm.type}
                          onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                          className="bg-black border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-white outline-none focus:border-[#FFC509]/50"
                        >
                          <option value="info">General</option>
                          <option value="system">System</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="warning">Warning</option>
                          <option value="alert">Alert</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <input 
                          className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FFC509]/50 font-semibold"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        />
                        <textarea 
                          className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-neutral-400 outline-none focus:border-[#FFC509]/50 resize-none font-medium leading-relaxed"
                          rows="3"
                          value={editForm.message}
                          onChange={(e) => setEditForm({...editForm, message: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-neutral-500 font-bold text-[10px] uppercase">
                          Cancel
                        </button>
                        <button onClick={() => handleSave(n._id)} className="flex-1 py-3 rounded-xl bg-[#FFC509] text-black font-bold text-[10px] uppercase flex items-center justify-center gap-2">
                          Save Changes <Check size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // standard notification view
                    <div className="flex gap-4">
                      <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border ${styles.border} ${styles.bg} ${styles.color}`}>
                        <CategoryIcon size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider truncate pr-2">
                            {n.title}
                          </h4>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => startEditing(n)} className="p-1.5 text-neutral-700 hover:text-white transition-colors">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(n._id)} className="p-1.5 text-neutral-700 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-500 leading-relaxed mb-3 line-clamp-2 font-medium">
                          {n.message}
                        </p>

                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${styles.color}`}>
                            {styles.label}
                          </span>
                          <span className="text-[9px] font-bold text-neutral-700 uppercase">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // empty state when no notifications exist
            <div className="h-full flex flex-col items-center justify-center py-20">
              <BellOff size={40} className="mb-4 text-neutral-900" />
              <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest">No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationDrawer;
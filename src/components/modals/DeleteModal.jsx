import React from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

const DeleteModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Are you sure?", 
  message = "This action cannot be undone and the data will be permanently removed.",
  loading = false,
  confirmText = "Delete Permanently"
}) => {
  // hides component if toggle is false
  if (!isOpen) return null;

  return (
    // dark background blur that covers the whole screen
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      {/* clicking outside the box cancels, but disabled when loading */}
      <div className="absolute inset-0" onClick={loading ? null : onCancel} />

      {/* the actual modal card with dark theme styling */}
      <div className="relative bg-[#0A0A0A] border border-white/10 p-8 rounded-[2.5rem] text-center w-full max-w-[320px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* red trash icon with a subtle tilt */}
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <Trash2 size={28} />
        </div>

        {/* title and warning message */}
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 mb-8 leading-relaxed px-2">
          {message}
        </p>

        {/* confirm and cancel buttons */}
        <div className="flex flex-col gap-3">
          <button 
            disabled={loading}
            onClick={onConfirm} 
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-red-900/20"
          >
            {/* show spinning loader if true, otherwise show text */}
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              confirmText
            )}
          </button>
          
          <button 
            disabled={loading}
            onClick={onCancel} 
            className="w-full py-4 bg-white/[0.03] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-50 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
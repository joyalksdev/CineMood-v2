import React from "react";
import { Loader2, UserRoundX, ShieldAlert, UserCheck } from "lucide-react";

const ActionModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  loading = false,
  confirmText,
  variant = 'danger' 
}) => {
  // don't show anything if closed
  if (!isOpen) return null;

  // switch styles based on danger or warning variant
  const config = {
    danger: {
      icon: <UserRoundX size={28} />,
      iconBg: "bg-red-500/10 text-red-500",
      btnBg: "bg-red-600 hover:bg-red-500 shadow-red-900/20",
    },
    warning: {
      icon: <ShieldAlert size={28} />,
      iconBg: "bg-amber-500/10 text-amber-500",
      btnBg: "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20",
    }
  }[variant];

  return (
    // full screen dark overlay with blur
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      {/* clicking the backdrop closes the modal unless loading */}
      <div className="absolute inset-0" onClick={loading ? null : onCancel} />

      {/* modal box with dark theme and rounded corners */}
      <div className="relative bg-[#0A0A0A] border border-white/10 p-8 rounded-[2.5rem] text-center w-full max-w-[320px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* icon box with a slight tilt for style */}
        <div className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3`}>
          {config.icon}
        </div>

        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 mb-8 leading-relaxed px-2">
          {message}
        </p>

        {/* action buttons stack */}
        <div className="flex flex-col gap-3">
          {/* confirm button - shows spinner when loading */}
          <button 
            disabled={loading}
            onClick={onConfirm} 
            className={`w-full py-4 ${config.btnBg} disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : confirmText}
          </button>
          
          {/* cancel button */}
          <button 
            disabled={loading}
            onClick={onCancel} 
            className="w-full py-4 bg-white/[0.03] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-50 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
import React from "react";
import { X, BellOff, Info, AlertTriangle, ShieldAlert, MessageSquare, Check, RefreshCw, Construction, Zap } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDrawer = ({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead, onRefresh, loading }) => {
  useLockBodyScroll(isOpen);

  const getIcon = (type) => {
    switch (type) {
      case 'maintenance': return <Construction className="text-orange-400/80" size={18} />;
      case 'system': return <ShieldAlert className="text-blue-400/80" size={18} />;
      case 'warning': return <AlertTriangle className="text-[#FFC509]/80" size={18} />;
      case 'alert': return <Zap className="text-red-500/80" size={18} />;
      case 'message': return <MessageSquare className="text-blue-400/80" size={18} />;
      default: return <Info className="text-green-400/80" size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          {/* Backdrop with soft blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-2xl"
          >
            
            {/* Header: Clean & Modern */}
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Notifications</h3>
                <p className="text-xs text-neutral-500 mt-1">Updates from your CineMood circle</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={onRefresh} 
                  className={`p-2.5 hover:bg-white/5 rounded-full text-neutral-400 transition-all ${loading ? 'animate-spin text-[#FFC509]' : ''}`}
                >
                  <RefreshCw size={18} />
                </button>
                <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <motion.div 
                    key={n._id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                      n.isRead 
                      ? 'bg-transparent border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.02]' 
                      : 'bg-white/[0.03] border-white/10 hover:border-[#FFC509]/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* New Notification Dot with Ping Animation */}
                    {!n.isRead && (
                      <div className="absolute top-5 right-5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC509] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFC509]"></span>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className={`mt-0.5 shrink-0 h-9 p-2 rounded-xl border border-white/5 ${n.isRead ? 'bg-white/5' : 'bg-[#FFC509]/10'}`}>
                        {getIcon(n.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`text-[14px] font-semibold tracking-tight leading-snug ${n.isRead ? 'text-neutral-400' : 'text-white'}`}>
                          {n.title}
                        </h4>
                        <p className={`text-xs mt-1 leading-relaxed ${n.isRead ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {n.message}
                        </p>
                        
                        <div className="flex items-center justify-between pt-3">
                           <span className="text-[10px] text-neutral-600 font-medium">
                            {new Date(n.scheduledAt || n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {!n.isRead && (
                            <button 
                              onClick={() => onMarkRead(n._id)}
                              className="flex items-center gap-1.5 text-[11px] font-medium text-green-400 hover:text-green-300 transition-colors"
                            >
                              <Check size={14} /> Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 py-20">
                  <div className="p-4 bg-white/5 rounded-full mb-4">
                    <BellOff size={28} className="opacity-20" />
                  </div>
                  <p className="text-sm font-medium opacity-40 tracking-tight">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
              <button 
                onClick={onMarkAllRead}
                disabled={notifications.every(n => n.isRead) || notifications.length === 0}
                className="w-full py-3.5 rounded-xl bg-[#FFC509] text-black text-sm font-bold hover:bg-yellow-400 transition-all duration-300 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,197,9,0.15)]"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
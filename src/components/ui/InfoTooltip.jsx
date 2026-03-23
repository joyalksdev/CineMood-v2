import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';

const InfoTooltip = ({ title, content, iconSize = 16 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click happened outside the tooltip container
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Also handle touch for better mobile support
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      {/* Trigger Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          setIsOpen(!isOpen);
        }}
        className={`flex items-center justify-center transition-all duration-300 active:scale-90 ${
          isOpen ? 'text-[#FFC509] drop-shadow-[0_0_8px_rgba(255,197,9,0.4)]' : 'text-white/30 hover:text-white/80'
        }`}
      >
        <Info size={iconSize} strokeWidth={2.5} />
      </button>

      {/* Tooltip Content */}
      {isOpen && (
        <div className="absolute left-0 md:-left-4 top-10 w-[260px] md:w-80 p-5 bg-neutral-900/98 border border-white/10 rounded-2xl shadow-2xl z-[100] backdrop-blur-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2">
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-[#FFC509] rounded-full" />
               <p className="font-black text-[#FFC509] text-[10px] uppercase tracking-[0.15em]">
                 {title || "Neural Analysis"}
               </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body Text */}
          <p className="text-[11px] md:text-xs text-white/70 leading-relaxed font-medium">
            {content}
          </p>
          
          {/* Decorative Arrow (Pointing to the Info icon) */}
          <div className="absolute -top-1.5 left-1.5 md:left-5 w-2.5 h-2.5 bg-neutral-900/98 border-l border-t border-white/10 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
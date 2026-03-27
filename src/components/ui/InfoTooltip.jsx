import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';

const InfoTooltip = ({ title, content, iconSize = 16 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: '100%', left: '0' });
  const tooltipRef = useRef(null);
  const contentRef = useRef(null);

  const calculatePosition = () => {
    if (!tooltipRef.current || !contentRef.current) return;

    const triggerRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = 280; // Hardcoded width for calculation
    const tooltipHeight = 150; // Estimated height
    const padding = 20;

    let newLeft = 0;
    let newTop = 40; // Default: below the icon

    // 1. Check Horizontal Collision (Right edge)
    if (triggerRect.left + tooltipWidth > window.innerWidth - padding) {
      // Flip to left side of icon
      newLeft = -(tooltipWidth - triggerRect.width);
    }

    // 2. Check Vertical Collision (Bottom edge)
    if (triggerRect.bottom + tooltipHeight > window.innerHeight - padding) {
      // Flip to appear ABOVE the icon
      newTop = -tooltipHeight - 10;
    }

    setPosition({ 
      top: `${newTop}px`, 
      left: `${newLeft}px` 
    });
  };

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the DOM element exists for measurement
      requestAnimationFrame(calculatePosition);
      
      const handleClickOutside = (event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      {/* Trigger Icon */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
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
        <div 
          ref={contentRef}
          style={{ 
            top: position.top, 
            left: position.left,
            position: 'absolute'
          }}
          className="w-[260px] md:w-80 p-5 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[999] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-[#FFC509] rounded-full" />
              <p className="font-black text-[#FFC509] text-[10px] uppercase tracking-widest">
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
          
          {/* We removed the static arrow because it might point the wrong way when flipped */}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
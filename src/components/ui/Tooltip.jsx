import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ children, text, delay = 0, active = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, maxWidth: 250 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const padding = 20;
      const windowWidth = window.innerWidth;
      
      // 1. Calculate the center X of the element
      let centerX = rect.left + rect.width / 2;

      // 2. Prevent Tooltip from bleeding off the LEFT or RIGHT edges
      const halfWidth = 125; // Default half of our 250px max
      if (centerX - halfWidth < padding) {
        centerX = padding + halfWidth; // Push right
      } else if (centerX + halfWidth > windowWidth - padding) {
        centerX = windowWidth - padding - halfWidth; // Push left
      }

      // 3. Calculate dynamic max width based on available screen real estate
      // This ensures that even on tiny screens, it stays within the box
      const availableWidth = windowWidth - (padding * 2);
      const finalMax = Math.min(250, availableWidth);

      setCoords({
        x: centerX,
        y: rect.top - 8,
        maxWidth: finalMax
      });
    }
  };

  const handleMouseEnter = () => {
    if (!active || !text) return;
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  return (
    <>
      {/* Wrapper MUST stay inline-block to not break your grid/flex layouts */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block cursor-default"
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              maxWidth: `${coords.maxWidth}px`,
              transform: "translate(-50%, -100%)",
            }}
            className="fixed z-[99999] pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          >
            {/* The Bubble: Now with 'break-words' to prevent horizontal overflow */}
            <div className="bg-black border border-white/10 px-3 py-1.5 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] text-[#FFC509] leading-tight text-center break-words">
                {text}
              </p>
            </div>
            
            {/* The Arrow */}
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white/10 mx-auto" />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
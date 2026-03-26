import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ children, text, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        // Center of the element horizontally
        x: rect.left + rect.width / 2,
        // Top of the element minus some spacing
        y: rect.top - 8,
      });
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // Update position if user scrolls while hovering
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
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform: "translate(-50%, -100%)",
            }}
            className="fixed z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Tooltip Bubble */}
            <div className="bg-black border border-white/10 px-3 py-1.5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFC509] whitespace-nowrap">
                {text}
              </p>
            </div>
            
            {/* Arrow */}
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-white/10 mx-auto" />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
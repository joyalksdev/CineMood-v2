import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Tooltip from './Tooltip'; 

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 1. Check if user has scrolled down enough (400px)
      // 2. ONLY show if the page is actually long (scrollHeight > 1500px)
      const isLongPage = document.documentElement.scrollHeight > 1500;
      
      if (window.pageYOffset > 400 && isLongPage) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          // bottom-24 gives space for the support button underneath
          className="fixed bottom-24 right-8 z-[99]"
        >
          <Tooltip text="Scroll to Top" position="top">
            <button
              onClick={scrollToTop}
              className="relative p-4 rounded-2xl bg-[#FFC509] text-black shadow-[0_10px_30px_rgba(255,197,9,0.3)] hover:scale-110 active:scale-95 transition-transform group"
              aria-label="Scroll to top"
            >
              <ArrowUp size={24} strokeWidth={2.5} />
              
              {/* Subtle Outer Ring Animation */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2 border-[#FFC509] pointer-events-none"
              />
            </button>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
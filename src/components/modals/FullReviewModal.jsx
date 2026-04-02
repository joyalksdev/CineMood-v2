import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoClose, IoStar } from 'react-icons/io5';
import { RiDoubleQuotesL } from 'react-icons/ri';

const FullReviewModal = ({ review, onClose }) => {

  // dont render if there is no review data
  if (!review) return null;

  const author = review.userName || review.author;
  const rating = review.rating || review.author_details?.rating || "?";

  return (
    // fixed wrapper to cover the whole screen
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 outline-none">
      
      {/* dark backdrop with blur effect - clicks here close the modal */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-zoom-out"
      />
      
      {/* the actual modal content box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* large decorative quote icon in the background */}
        <RiDoubleQuotesL className="absolute -top-6 -right-6 text-white/[0.03] size-56 pointer-events-none" />

        {/* header section with author info and close button */}
        <div className="relative z-20 flex justify-between items-center p-6 md:p-8 border-b border-white/5 bg-[#0d0d0d]">
          <div className="flex items-center gap-4">
            {/* avatar generated from first letter of name */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC509] to-orange-500 flex items-center justify-center text-black font-black text-xl shadow-lg">
              {author[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">{author}</h3>
              <span className="flex items-center gap-1 text-[#FFC509] text-xs font-black tracking-widest uppercase">
                <IoStar size={14} /> {rating} / 10
              </span>
            </div>
          </div>
          {/* close button with hover scaling */}
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 hover:bg-[#FFC509] hover:text-black rounded-2xl transition-all duration-300 border border-white/10 group"
          >
            <IoClose size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* scrollable area for the review text */}
        <div data-lenis-prevent className="relative z-10 p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar overscroll-contain">
          <div className="text-neutral-300 text-lg md:text-xl leading-relaxed italic font-medium border-l-4 border-[#FFC509]/30 pl-8 py-2 whitespace-pre-wrap">
            "{review.content || review.text}"
          </div>

          {/* footer element inside scroll area to signal the end */}
          <div className="mt-20 pb-6 flex flex-col items-center gap-4 opacity-40">
             <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
             <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.5em]">
                Review Complete
             </p>
             <div className="h-1.5 w-1.5 rounded-full bg-[#FFC509] shadow-[0_0_10px_#FFC509]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FullReviewModal;
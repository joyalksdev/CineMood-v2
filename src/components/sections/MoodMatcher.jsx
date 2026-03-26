import React, { useState } from "react";
import { FaSmile, FaSadTear, FaFire, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutGrid } from "lucide-react";

const moods = [
  {
    label: "Happy",
    icon: <FaSmile size={20} />,
    activeClass: "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-[0_0_20px_rgba(255,197,9,0.15)]",
    genres: [35, 16],
  },
  {
    label: "Romantic",
    icon: <FaHeart size={20} />,
    activeClass: "border-rose-500 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    genres: [10749, 18],
  },
  {
    label: "Thrilling",
    icon: <FaFire size={20} />,
    activeClass: "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    genres: [28, 53],
  },
  {
    label: "Sad",
    icon: <FaSadTear size={20} />,
    activeClass: "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    genres: [18],
  },
];

const MoodMatcher = () => {
  const [activeMood, setActiveMood] = useState(null);
  const [typedMood, setTypedMood] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (activeMood) {
      navigate(`/mood/${activeMood.label.toLowerCase()}`, {
        state: { genres: activeMood.genres, mood: activeMood.label },
      });
    } else if (typedMood.trim()) {
      navigate(`/mood/custom`, {
        state: { mood: typedMood },
      });
    }
  };

  return (
    <section className="relative w-full py-12 md:py-16 flex flex-col items-center justify-center rounded-[2.5rem] text-center bg-[#070707] border border-white/5 overflow-hidden px-6">
      
      {/* Subtle Branding Glow */}
      <div className="pointer-events-none absolute w-[400px] h-[400px] bg-[#FFC509]/5 blur-[120px] rounded-full -top-40 -left-20" />

      {/* Tagline: Clear and Functional */}
      <div className="relative z-10 flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-white/[0.03] border border-white/5">
        <LayoutGrid size={12} className="text-[#FFC509]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">Instant Filter</span>
      </div>

      <h2 className="relative z-10 text-2xl md:text-4xl font-black text-white tracking-wide px-4  leading-none">
        Pick Your <span className="text-[#FFC509]">Mood</span>
      </h2>

      {/* Mood Grid: Tactile & Interactive */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 w-full max-w-xl">
        {moods.map((mood, i) => {
          const isSelected = activeMood?.label === mood.label;
          return (
            <button
              key={i}
              onClick={() => {
                setActiveMood(mood);
                setTypedMood("");
              }}
              className={`group flex flex-col items-center justify-center gap-3 p-5 h-24 rounded-2xl border transition-all duration-300 outline-none
              ${isSelected 
                ? mood.activeClass 
                : "bg-white/[0.02] border-white/5 text-neutral-500 hover:border-white/20 hover:text-white"
              } active:scale-95`}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {mood.icon}
              </div>
              <span className="font-bold text-[10px] uppercase tracking-widest">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input: Simple and Clean */}
      <div className="relative z-10 mt-8 w-full max-w-sm">
        <input
          value={typedMood}
          onChange={(e) => {
            setTypedMood(e.target.value);
            setActiveMood(null);
          }}
          placeholder="Or describe it: 'cozy', 'lonely'..."
          className="w-full px-6 py-4 rounded-xl bg-white/[0.02] border border-white/5 focus:border-[#FFC509]/40 outline-none text-white text-xs placeholder:text-neutral-600 transition-all"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={!activeMood && !typedMood.trim()}
        className="relative z-10 mt-8 px-10 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em]
        rounded-xl hover:bg-[#FFC509] transition-all duration-300 disabled:opacity-20 group flex items-center gap-3 shadow-2xl"
      >
        Find Movies
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </section>
  );
};

export default MoodMatcher;
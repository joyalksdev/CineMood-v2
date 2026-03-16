import React, { useState } from "react";
import { FaSmile, FaSadTear, FaFire, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const moods = [
  {
    label: "Happy",
    icon: <FaSmile />,
    color: "bg-yellow-400/20 text-yellow-300",
    genres: [35, 16],
  }, // Comedy, Animation
  {
    label: "Romantic",
    icon: <FaHeart />,
    color: "bg-pink-400/20 text-pink-300",
    genres: [10749, 18],
  }, // Romance, Drama
  {
    label: "Thrilling",
    icon: <FaFire />,
    color: "bg-red-400/20 text-red-300",
    genres: [28, 53],
  }, // Action, Thriller
  {
    label: "Sad",
    icon: <FaSadTear />,
    color: "bg-blue-400/20 text-blue-300",
    genres: [18],
  }, // Drama
];

const MoodMatcher = () => {
  const [activeMood, setActiveMood] = useState(null);
  const [typedMood, setTypedMood] = useState("");
  const navigate = useNavigate();

  return (
    <section
      className="relative py-14 md:py-20 flex flex-col items-center rounded-2xl text-center
      bg-gradient-to-br from-black via-zinc-900 to-black">
  
      <div className="pointer-events-none absolute w-[420px] h-[420px] bg-green-500/20 blur-[140px] rounded-full -top-32 -left-32" />
      <div className="pointer-events-none absolute w-[420px] h-[420px] bg-yellow-500/10 blur-[140px] rounded-full bottom-0 right-0" />

      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold heading px-4">
        How Are You Feeling Today?
      </h2>

      <p className="text-sm md:text-base text-neutral-400 px-6 mt-3 max-w-xl">
        Choose your mood and let us recommend movies that perfectly match your
        emotions.
      </p>

      <div className="relative z-10 flex flex-wrap justify-center gap-3 mt-6 px-4">
        {moods.map((mood, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveMood(mood);
              setTypedMood("");
            }}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full border border-white/10
        backdrop-blur-md ${
          mood.color
        } hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-yellow-400
        ${
          activeMood?.label === mood.label
            ? "ring-2 ring-yellow-400 scale-105"
            : ""
        }`}
          >
            {mood.icon}
            <span className="font-medium text-sm sm:text-base">
              {mood.label}
            </span>
          </button>
        ))}
      </div>


      <div className="relative z-10 mt-6 w-full max-w-md px-4">
        <input
          value={typedMood}
          onChange={(e) => {
            setTypedMood(e.target.value);
            setActiveMood(null);
          }}
          placeholder="Or type your mood… nostalgic, lonely"
          className="w-full px-5 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10
      focus:border-yellow-400 focus:ring-1 focus:ring-yellow-300 outline-none text-white placeholder:text-neutral-400"
        />
      </div>

 
      <button
        onClick={() => {
          if (activeMood) {
            navigate(`/mood/${activeMood.label.toLowerCase()}`, {
              state: { genres: activeMood.genres, mood: activeMood.label },
            });
          } else if (typedMood.trim()) {
            navigate(`/mood/custom`, {
              state: { mood: typedMood },
            });
          }
        }}
        disabled={!activeMood && !typedMood.trim()}
        className="relative z-10 mt-7 px-8 py-3 bg-yellow-400 text-black font-semibold
    rounded-xl hover:bg-yellow-300 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Find My Movies 🎬
      </button>
    </section>
  );
};

export default MoodMatcher;

import React from "react";
import { useUser } from "../context/UserContext";
import RecommendationCard from "../components/cards/RecommendationCard";
import MovieRow from "../components/cards/MovieRow";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchPopularAnime,
  fetchPopularMovies,
  fetchPopularKDramas,
} from "../services/tmbdApi";
import MoodMatcher from "../components/sections/MoodMatcher";
import { motion } from 'framer-motion';
import WeeklySpotlight from "../components/sections/WeeklySpotlight";
import { ShieldCheck, Sparkles } from "lucide-react";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
const floatingIcons = ["🎬", "🍿", "⭐️", "🎥", "🎞️", "📺"];

const Home = () => {
  const { user } = useUser();

  return (
    <div className="px-6 lg:px-10 pb-20">
      {/* 1. Cinematic Greeting Section */}
      <div className="px-6 lg:px-10 pb-20 overflow-hidden">
        {/* 1. Cinematic Greeting Section */}
        <div className="relative flex flex-col justify-center items-center py-20 md:py-28 gap-4 min-h-[40vh]">
          {/* Floating Background Elements */}
          {floatingIcons.map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.3, 0],
                x: Math.sin(i) * 50,
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              className="absolute text-2xl pointer-events-none select-none hidden md:block"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + Math.random() * 40}%`,
              }}
            >
              {emoji}
            </motion.span>
          ))}

          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
          >
            <Sparkles size={12} className="text-[#FFC509]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
              Cinema Experience
            </span>
            {user?.role === "admin" && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10 text-green-400">
                <ShieldCheck size={12} />
                <span className="text-[10px] font-black tracking-widest">
                  ADMIN
                </span>
              </div>
            )}
          </motion.div>

          {/* Staggered Text Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 relative z-10"
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-none italic "
            >
              Welcome back, <br className="md:hidden" />
              <span className="text-[#FFC509] drop-shadow-[0_0_20px_rgba(255,197,9,0.3)]">
                {user?.name || "Cinephile"}
              </span>{" "}
              
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-neutral-500 text-sm md:text-lg font-medium max-w-xl mx-auto tracking-wide"
            >
              Ready to find your next favorite movie? Your mood. Your movies.
              <span className="text-white font-bold ml-1">Your CineMood.</span>
            </motion.p>
          </motion.div>

          {/* Subtle Bottom Glow */}
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* 2. Main Content Sections */}
        <section className="flex flex-col gap-16">
          {/* ... Rest of your components */}
        </section>
      </div>

      {/* 2. Main Content Sections */}
      <section className="flex flex-col gap-16">
        <RecommendationCard />

        <MovieRow
          rowId="trending"
          title="🔥 Trending Now"
          fetchFn={fetchTrendingMovies}
        />

        <WeeklySpotlight />

        <MoodMatcher />

        <div className="flex flex-col gap-2">
          <MovieRow
            rowId="top_rated"
            title="🏆 Top Rated Masterpieces"
            fetchFn={fetchTopRatedMovies}
          />
          <MovieRow
            rowId="now_playing"
            title="🎬 In Theatres"
            fetchFn={fetchNowPlayingMovies}
          />
          <MovieRow
            rowId="popular_movies"
            title="🍿 Blockbuster Hits"
            fetchFn={fetchPopularMovies}
          />
          <MovieRow
            rowId="popular_kdrama"
            title="🇰🇷 K-Drama Wave"
            fetchFn={fetchPopularKDramas}
          />
          <MovieRow
            rowId="popular_anime"
            title="🍥 Anime Essentials"
            fetchFn={fetchPopularAnime}
          />
        </div>
      </section>
      <ScrollToTopButton />
    </div>
  );
};

export default Home;

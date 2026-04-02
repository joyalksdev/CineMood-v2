import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchMovieCredits, fetchMovieDetails } from "../services/tmbdApi";
import userPlaceholder from "../assets/user-placeholder.png";
import GoBackBtn from '../components/ui/GoBackBtn';
import { FadeLoader } from "react-spinners";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

const CastCrewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(null);
  const [movie, setMovie] = useState(null);

  // fetch movie data and credits on mount or id change
  useEffect(() => {
    Promise.all([fetchMovieCredits(id), fetchMovieDetails(id)]).then(
      ([creditsData, movieData]) => {
        setCredits(creditsData);
        setMovie(movieData);
      }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // loading state centered in viewport
  if (!credits || !movie) return (
    <div className="flex justify-center items-center h-[60vh]">
      <FadeLoader color="#FFC509" />
    </div>
  );

  // stagger children animations for the cast grid
  const containerVars = {
    animate: { transition: { staggerChildren: 0.05 } }
  };

  // individual item entrance animation
  const itemVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="relative min-h-screen text-white pb-20"
    >
      {/* cinematic background integration with dynamic movie backdrop */}
      <div className="absolute -top-26 left-0 lg:-left-10 w-[100vw] h-[400px] pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 lg:px-0 px-4 max-w-7xl mx-auto">
        <div className="pt-6">
            <GoBackBtn />
        </div>

        {/* page header with movie title and theme-based label */}
        <header className="mt-8 mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">{movie.title}</h2>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-1 w-8 bg-[#FFC509] rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Manifest: Cast & Crew</p>
          </div>
        </header>

        {/* cast section: "field operatives" grid */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl font-black tracking-tight uppercase italic">Field Operatives</h3>
            <span className="text-[10px] bg-[#FFC509]/10 border border-[#FFC509]/20 px-2 py-0.5 rounded-full text-[#FFC509] font-black">
              {credits.cast.length}
            </span>
          </div>

          <motion.div 
            variants={containerVars}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {credits.cast.map(person => (
              <motion.div
                key={person.id}
                variants={itemVars}
                onClick={() => navigate(`/person/${person.id}`)}
                className="group cursor-pointer"
              >
                {/* profile image with hover scaling and border effect */}
                <div className="relative overflow-hidden rounded-[2rem] aspect-[3/4] mb-4 border border-white/5 group-hover:border-[#FFC509]/50 transition-all duration-500 shadow-2xl">
                  <img
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w342${person.profile_path}` : userPlaceholder}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={person.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-bold text-sm truncate group-hover:text-[#FFC509] transition-colors">{person.name}</p>
                <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">{person.character}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* crew section: "technical support" glassmorphism list */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl font-black tracking-tight uppercase italic">Technical Support</h3>
            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-neutral-400 font-bold">
              {credits.crew.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {credits.crew.map((person, index) => (
              <motion.div
                key={`${person.id}-${person.job}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/person/${person.id}`)}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-5 rounded-[1.5rem] hover:bg-white/[0.07] hover:border-[#FFC509]/30 transition-all cursor-pointer group flex flex-col justify-center"
              >
                <p className="font-bold text-base group-hover:text-[#FFC509] transition-colors">{person.name}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#FFC509] rounded-full group-hover:animate-pulse" />
                  {person.job}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* utility components */}
      <ScrollToTopButton />
    </motion.div>
  );
};

export default CastCrewDetails;
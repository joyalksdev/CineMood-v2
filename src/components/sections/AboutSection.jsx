import React from 'react';
import { 
  Cpu, 
  Database, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Search, 
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  // core feature list with specific branding for AI and database tech
  const features = [
    {
      icon: <Sparkles className="text-[#FFC509]" size={24} />,
      title: "Neural Engine AI",
      desc: "Powered by Gemini AI, we analyze cinematic DNA to match movies to your current 'vibe' rather than just genres."
    },
    {
      icon: <Globe className="text-[#FFC509]" size={24} />,
      title: "TMDB Integration",
      desc: "Access a library of over 750,000+ movies with real-time updates on trailers, ratings, and cast details."
    },
    {
      icon: <Database className="text-[#FFC509]" size={24} />,
      title: "MERN Architecture",
      desc: "Built with MongoDB for flexible data, Express/Node for a lightning-fast API, and React for a fluid UI."
    }
  ];

  return (
    <div className="w-full bg-black text-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC509]/10 border border-[#FFC509]/20 mb-6"
          >
            <Cpu size={14} className="text-[#FFC509]" />
            <span className="text-[#FFC509] text-[10px] font-black uppercase tracking-widest">How it Works</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            Cinematic Intelligence <br />
            <span className="text-[#FFC509]">Redefined.</span>
          </h2>
          <p className="text-white/50 max-w-2xl text-lg font-medium leading-relaxed">
           While other apps just list titles, we treat your mood as a data point. 
           By mapping your current vibe against the global film index, we bridge 
           the gap between your headspace and the screen.
          </p>
        </div>

        {/* --- Feature Grid with scroll animations --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-neutral-900/40 border border-white/5 hover:border-[#FFC509]/30 transition-colors group"
            >
              <div className="mb-6 p-3 bg-black/40 w-fit rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* --- Deep Dive: Weekly Spotlight & Technical Breakdown --- */}
        <div className="relative rounded-[3rem] bg-gradient-to-br from-neutral-900 to-black border border-white/5 p-8 md:p-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 order-2 lg:order-1">
                <div className="space-y-3">
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                    The <span className="text-[#FFC509]">Weekly</span> Spotlight
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm md:text-base">
                    We synthesize your cinema DNA. By mapping your watchlist history through our 
                    <span className="font-semibold text-white/80"> Gemini AI Neural Engine</span>, we create a 
                    semantic profile of your taste. Using <span className="font-semibold text-white/80">MongoDB aggregation</span>, 
                    we cross-reference this data with the TMDB API to discover hidden gems that 
                    match your specific <span className="text-[#FFC509] font-semibold italic">vibe</span>.
                    </p>
                </div>

                {/* mini-feature list for technical capabilities */}
                <ul className="grid grid-cols-1 gap-4">
                    {[
                    { 
                        icon: <Zap size={16} />, 
                        text: "Real-time Sync",
                        sub: "Instant library updates." 
                    },
                    { 
                        icon: <Search size={16} />, 
                        text: "Semantic Search", 
                        sub: "Find movies by mood." 
                    },
                    { 
                        icon: <ShieldCheck size={16} />, 
                        text: "Secure Auth", 
                        sub: "Enterprise-grade protection." 
                    }
                    ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                        <span className="p-2 rounded-xl bg-[#FFC509]/5 text-[#FFC509] border border-[#FFC509]/10">
                        {item.icon}
                        </span>
                        <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
                            {item.text}
                        </span>
                        <span className="text-[10px] text-white/30 font-medium">
                            {item.sub}
                        </span>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>

            {/* mockup display area with hover effects */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-video bg-neutral-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-crosshair">
                <img 
                  src="./weekly-spotlight.png" 
                  alt="CineMood Interface" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
              </div>
              {/* decorative glow effect */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FFC509]/10 rounded-full blur-3xl -z-10" />
            </div>

          </div>
        </div>

        {/* --- Back to Top Action --- */}
        <div className="mt-20 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full overflow-hidden transition-all hover:pr-14"
          >
            <span className="relative z-10">Back to Top</span>
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-4 bg-[#FFC509] translate-x-full group-hover:translate-x-0 transition-transform">
                <Zap size={16} />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutSection;
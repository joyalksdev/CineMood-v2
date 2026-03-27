import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter, Sparkles, Github, ArrowUpRight, Globe, Code2, Instagram, Cpu, Database, Zap, BrainCircuit, Layers } from 'lucide-react';

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#FFC509] selection:text-black">
      {/* Insane UI Background: Cyber Grid & Radial Glows */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFC509]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-6"
        >
          {/* --- HERO SECTION --- */}
          <motion.div variants={itemVariants} className="col-span-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-[#FFC509]/50" />
              <span className="text-[#FFC509] text-xs font-medium tracking-[0.3em] uppercase">The Architect</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-none">
              Crafting Digital <br />
              <span className="font-medium text-neutral-400">Atmospheres.</span>
            </h1>
          </motion.div>

          {/* --- BENTO BOX 1: THE CREATOR IMAGE --- */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-5 aspect-square md:aspect-auto md:h-[600px] relative group overflow-hidden rounded-[2rem] border border-white/10"
          >
            <img 
              src="./joyalks.jpg" 
              alt="joyalksdev" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8">
              <p className="text-2xl font-medium">joyalksdev</p>
              <p className="text-sm text-yellow-300/80"> Developer & Designer</p>
            </div>
          </motion.div>

          {/* --- BENTO BOX 2: ABOUT / VISION --- */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-7 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between"
          >
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="p-3 bg-[#FFC509]/10 rounded-2xl">
                  <Code2 className="text-[#FFC509]" size={24} />
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Globe className="text-blue-400" size={24} />
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                More than <span className="text-[#FFC509]">Syntax.</span>
                </h2>
                <p className="text-neutral-400 text-lg leading-relaxed">
                Building CineMood required a shift from standard data fetching to <span className="text-white/80 font-semibold">intelligent synthesis</span>. Every layer of the stack is optimized to bridge the gap between technical precision and the human connection to film.
                </p>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 border-t border-white/5 pt-10">
                {/* Tech Stack Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#FFC509]/10">
                        <Layers size={14} className="text-[#FFC509]" />
                    </div>
                    <p className="text-[#FFC509] text-[10px] font-black uppercase tracking-[0.2em]">The Stack</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {[
                        { name: 'React', icon: <Code2 size={12} /> },
                        { name: 'Node.js', icon: <Cpu size={12} /> },
                        { name: 'MongoDB', icon: <Database size={12} /> },
                        { name: 'Tailwind', icon: <Zap size={12} /> }
                    ].map((tech) => (
                        <div key={tech.name} className="flex items-center gap-2 text-neutral-400 group cursor-default">
                        <span className="text-neutral-600 group-hover:text-[#FFC509] transition-colors">{tech.icon}</span>
                        <span className="text-xs font-bold tracking-tight group-hover:text-white transition-colors">{tech.name}</span>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Philosophy Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#FFC509]/10">
                        <BrainCircuit size={14} className="text-[#FFC509]" />
                    </div>
                    <p className="text-[#FFC509] text-[10px] font-black uppercase tracking-[0.2em]">Philosophy</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                    {[
                        { title: 'Clean Code', sub: 'Scalable MVC Architecture' },
                        { title: 'Deep Logic', sub: 'AI-Driven Personalization' }
                    ].map((item) => (
                        <div key={item.title} className="flex flex-col border-l border-white/5 pl-4 hover:border-[#FFC509]/30 transition-colors">
                        <span className="text-xs font-black uppercase text-white tracking-wider">{item.title}</span>
                        <span className="text-[10px] text-neutral-500 font-medium italic">{item.sub}</span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
          </motion.div>

          {/* --- BENTO BOX 3: CONTACT LINKS --- */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-8 bg-[#FFC509] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between group cursor-pointer overflow-hidden relative"
          >
            <div className="relative z-10 text-black">
              <h3 className="text-4xl font-medium tracking-tight">Have a vision?</h3>
              <p className="font-medium opacity-70">Let's build the next neural experience together.</p>
            </div>
            
            <a 
              href="https://wa.link/jknzkm"
              target="_blank"
              className="mt-6 md:mt-0 relative z-10 px-8 py-4 bg-black text-white rounded-full font-medium flex items-center gap-2 group-hover:scale-105 transition-transform"
            >
              Start a Conversation <ArrowUpRight size={18} />
            </a>

            {/* Hidden Large Text Decoration */}
            <span className="absolute -bottom-4 -right-4 text-9xl font-black text-black/5 pointer-events-none select-none">
              HIRE
            </span>
          </motion.div>

          {/* --- BENTO BOX 4: SOCIALS --- */}
          <motion.div 
            variants={itemVariants}
            className="col-span-12 md:col-span-4 grid grid-cols-3 gap-4"
          >
            {[
              { Icon: Github, link: "https://github.com/joyalksdev" },
              { Icon: Linkedin, link: "https://www.linkedin.com/in/joyalks" },
              { Icon: Instagram, link: "https://www.instagram.com/joyalks.dev" }
            ].map((social, i) => (
              <a 
                key={i}
                href={social.link}
                target="_blank"
                className="aspect-square bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center hover:bg-[#FFC509] hover:text-black transition-all duration-500 group"
              >
                <social.Icon size={24} className="group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Contact;
import React from 'react';
import { Github, Instagram, Mail, ExternalLink, Code2, Terminal, Cpu, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DeveloperSpotlight = () => {
  const socialLinks = [
    { icon: <Github size={18} />, label: "GitHub", url: "https://github.com/joyalksdev" },
    { icon: <Instagram size={18} />, label: "Instagram", url: "https://www.instagram.com/joyalks.dev" },
    { icon: <Mail size={18} />, label: "Email", url: "mailto:joyalksdev@gmail.com" }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24">
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC509] to-amber-600 rounded-[3rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
        
        <div className="relative bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-8 md:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Terminal size={300} />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            
            {/* Visual Profile Area */}
            <div className="relative">
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-[#FFC509] via-[#FFC509]/20 to-transparent p-[2px]">
                <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden border-[6px] border-[#0A0A0A]">
                  <Terminal size={60} className="text-[#FFC509]" />
                </div>
              </div>
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-2 -right-2 bg-[#FFC509] text-black p-4 rounded-2xl shadow-[0_10px_30px_rgba(255,197,9,0.3)]"
              >
                <Code2 size={24} />
              </motion.div>
            </div>

            {/* Content Area */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC509]/10 border border-[#FFC509]/20">
                  <Cpu size={12} className="text-[#FFC509]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFC509]">System Architect</span>
                </div>
                
                <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  joyalks<span className="text-[#FFC509]">dev</span>
                </h3>
                
                <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                  Building the next generation of <span className="text-white/80">intelligent web applications</span>. 
                  Specializing in MERN stack architecture with a focus on AI-driven user experiences.
                </p>
              </div>

              {/* Action Rows */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
                {/* Primary Contact Link */}
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-[#FFC509] text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all hover:-translate-y-1 shadow-lg shadow-[#FFC509]/10"
                >
                  <Send size={16} />
                  Get In Touch
                </Link>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-[56px] h-[56px] bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-2xl text-white/60 hover:text-[#FFC509]"
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Stack Mini-Marquee */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 border-t border-white/5">
                {['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind'].map((tech) => (
                  <span key={tech} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-[#FFC509] transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSpotlight;
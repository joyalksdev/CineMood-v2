import React from "react";
import { 
  MessageSquare, 
  LifeBuoy, 
  FileText, 
  ArrowUpRight, 
  Code2,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const SupportAside = () => {
  // centralizing link data for easy maintenance and clean mapping
  const links = [
    {
      title: "Contact Developer",
      desc: "Technical bug reports",
      icon: <Code2 size={18} />,
      to: "/contact",
      color: "hover:text-[#FFC509]"
    },
    {
      title: "Help Center",
      desc: "FAQ & Tutorials",
      icon: <LifeBuoy size={18} />,
      to: "/help",
      color: "hover:text-blue-400"
    },
    {
      title: "Legal Docs",
      desc: "Privacy & Terms",
      icon: <FileText size={18} />,
      to: "/legal",
      color: "hover:text-neutral-400"
    }
  ];

  return (
    // sticky aside that stays in view while scrolling on desktop
    <aside className="w-full lg:w-80 sticky top-32 h-fit bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/10 group/aside">
      
      {/* support header with brand italic styling */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 text-[#FFC509] mb-2">
          <HelpCircle size={14} />
          <span className="text-[12px] font-black italic uppercase tracking-[0.2em]">Support</span>
        </div>
        <h2 className="text-xl font-black italic tracking-tighter text-white leading-none">
          System Support
        </h2>
      </div>

      {/* navigation stack with custom hover transitions and scaling */}
      <nav className="space-y-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.to}
            className={`group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 active:scale-[0.97] ${link.color}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-black/40 rounded-xl text-inherit border border-white/5 group-hover:border-inherit/20 transition-all">
                {link.icon}
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-white group-hover:text-inherit transition-colors leading-none">
                  {link.title}
                </h3>
                <p className="text-[10px] text-neutral-500 font-medium mt-1 opacity-70">
                  {link.desc}
                </p>
              </div>
            </div>
            {/* arrow icon that slides up-right on hover */}
            <ArrowUpRight 
              size={16} 
              className="text-neutral-700 group-hover:text-inherit transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            />
          </Link>
        ))}
      </nav>

      {/* bottom version info with a glowing pulse indicator */}
      <div className="mt-8 pt-6 border-t border-white/5 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFC509] animate-pulse shadow-[0_0_8px_#FFC509]" />
            <span className="text-[10px] font-black italic uppercase tracking-[0.2em] text-neutral-600">
              CineMood v2.0.4
            </span>
          </div>
          <span className="text-[9px] font-bold text-neutral-800 group-hover/aside:text-neutral-500 transition-colors">
            Stable Link
          </span>
        </div>
      </div>
    </aside>
  );
};

export default SupportAside;
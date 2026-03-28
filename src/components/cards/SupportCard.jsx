import React from "react";
import { 
  LifeBuoy, 
  FileText, 
  ArrowUpRight, 
  Code2 
} from "lucide-react";

const SupportBar = () => {
  const links = [
    {
      title: "Contact Developer",
      desc: "Tech reports",
      icon: <Code2 size={18} />,
      href: "mailto:dev@cinemood.com",
      color: "hover:text-[#FFC509]"
    },
    {
      title: "Help Center",
      desc: "FAQ & Tutorials",
      icon: <LifeBuoy size={18} />,
      href: "/help",
      color: "hover:text-blue-400"
    },
    {
      title: "Legal Docs",
      desc: "Privacy Policy",
      icon: <FileText size={18} />,
      href: "/legal",
      color: "hover:text-neutral-400"
    }
  ];

  return (
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        
        {/* Leading Brand Section */}
        <div className="flex items-center gap-4 px-4 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-8">
          <div className="w-2 h-2 rounded-full bg-[#FFC509] animate-pulse shadow-[0_0_8px_#FFC509]" />
          <div>
            <h2 className="text-lg font-black italic tracking-tighter text-white leading-none">
              System Support
            </h2>
            <p className="text-[10px] font-black italic uppercase tracking-[0.2em] text-neutral-600 mt-1">
              v2.0.4
            </p>
          </div>
        </div>

        {/* Horizontal Links */}
        <nav className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={`group flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 active:scale-[0.97] ${link.color}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/40 rounded-lg text-inherit border border-white/5 group-hover:border-inherit/20 transition-all">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-inherit transition-colors leading-none">
                    {link.title}
                  </h3>
                  <p className="text-[9px] text-neutral-500 font-medium mt-1 opacity-60">
                    {link.desc}
                  </p>
                </div>
              </div>
              <ArrowUpRight 
                size={14} 
                className="text-neutral-700 group-hover:text-inherit transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SupportBar;
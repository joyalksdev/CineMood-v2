import React, { useEffect, useState } from "react";
import {
  Shield,
  FileText,
  Cookie,
  ChevronRight,
  Lock,
  Eye,
  Database,
  Terminal,
} from "lucide-react";

const LegalDocs = () => {
  const [activeTab, setActiveTab] = useState("privacy");

  const menuItems = [
    { id: "privacy", label: "Privacy Policy", icon: <Shield size={18} /> },
    { id: "terms", label: "Terms & Conditions", icon: <FileText size={18} /> },
    { id: "cookies", label: "Cookie Policy", icon: <Cookie size={18} /> },
  ];

  const content = {
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "March 2026",
      sections: [
        {
          head: "1. Data Collection",
          body: "We collect minimal data required for your experience: Email (via JWT auth), Watchlist history, and movie preferences. We do not sell this data to third parties.",
        },
        {
          head: "2. AI Processing",
          body: "Your cinematic DNA is processed via Gemini AI to generate recommendations. This data is mapped semantically and stored securely in our MongoDB Atlas instance.",
        },
        {
          head: "3. Security",
          body: "All transmissions are encrypted via SSL. We use industry-standard hashing for passwords and sensitive identifiers.",
        },
      ],
    },
    terms: {
      title: "Terms & Conditions",
      lastUpdated: "March 2026",
      sections: [
        {
          head: "1. User Accounts",
          body: "By creating an account on CineMood, you agree to provide accurate information. You are responsible for the security of your authentication tokens.",
        },
        {
          head: "2. Content Attribution",
          body: "Movie data, images, and trailers are provided by the TMDB API. CineMood is a discovery platform and does not host copyrighted video content.",
        },
        {
          head: "3. Prohibited Use",
          body: "Users may not attempt to reverse-engineer the Neural Engine or scrape the database for commercial purposes.",
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      lastUpdated: "March 2026",
      sections: [
        {
          head: "1. Essential Cookies",
          body: "We use local storage and essential cookies to keep you logged in and remember your UI preferences (Dark Mode).",
        },
        {
          head: "2. Analytics",
          body: "Minimal tracking is used to monitor system performance and AI accuracy. No personally identifiable information is stored in these cookies.",
        },
      ],
    },
  };

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (["privacy", "terms", "cookies"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 text-[#FFC509] mb-1">
              <Terminal size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Documentation
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Legal Center</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-[#FFC509] text-black font-bold"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-neutral-900/30 border border-white/5 rounded-[2.5rem] p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
          <header className="mb-12 border-b border-white/5 pb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              {content[activeTab].title}
            </h1>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              Last Version: {content[activeTab].lastUpdated}
            </p>
          </header>

          <div className="space-y-10">
            {content[activeTab].sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h3 className="text-[#FFC509] text-lg font-bold flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-[#FFC509]/30" />
                  {section.head}
                </h3>
                <p className="text-white/50 leading-relaxed max-w-3xl">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {/* Bottom Callout */}
          <footer className="mt-16 p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-[#FFC509]/10 rounded-xl text-[#FFC509]">
              <Lock size={20} />
            </div>
            <p className="text-[11px] text-white/40 font-medium leading-relaxed">
              Questions about our architecture or data handling? <br />
              <a href="/contact" className="text-[#FFC509] hover:underline">
                Contact the system administrator.
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default LegalDocs;

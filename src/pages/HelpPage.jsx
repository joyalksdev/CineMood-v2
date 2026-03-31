import React, { useState } from "react";
import { 
  Search, 
  MessageSquare, 
  Mail, 
  User, 
  Loader2, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ChevronDown 
} from 'lucide-react';
import api from "../services/axios";
import toast from "react-hot-toast";

const HelpPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How does the AI recommendation work?",
      answer: "We use a Gemini AI-powered Neural Engine that analyzes your watchlist history to create a semantic map of your tastes, matching you with movies based on 'vibe' rather than just genre.",
      icon: <Sparkles size={18} className="text-[#FFC509]" />
    },
    {
      question: "Can I sync my watchlist across devices?",
      answer: "Yes. Your account is secured via JWT authentication and a dedicated MongoDB cloud instance, allowing your movies and personalized 'Weekly Spotlight' to stay in sync wherever you log in.",
      icon: <Zap size={18} className="text-[#FFC509]" />
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and secure MongoDB aggregation pipelines to ensure your personal cinematic DNA remains private.",
      icon: <ShieldCheck size={18} className="text-[#FFC509]" />
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const { data } = await api.post('/support/contact', formData);
      if (data.success) {
        setStatus("success");
        toast.success("Transmission Received 🚀");
        setTimeout(() => {
          setStatus("idle");
          setFormData({ name: "", email: "", message: "" });
        }, 2000);
      }
    } catch (error) {
      setStatus("idle");
      toast.error("Transmission failed. Check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: FAQs & Info */}
        <div className="space-y-12">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC509]/10 border border-[#FFC509]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC509] animate-pulse" />
              <span className="text-[#FFC509] text-[10px] font-black uppercase tracking-widest">Knowledge Base</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              How can we <br />
              <span className="text-[#FFC509]">help?</span>
            </h1>
            <p className="text-white/40 text-lg font-medium max-w-md">
              Find instant answers to common questions or reach out to our neural support unit.
            </p>
          </header>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group border border-white/5 bg-neutral-900/30 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-[#FFC509]/30"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                      {faq.icon}
                    </div>
                    <span className="font-bold text-sm tracking-tight">{faq.question}</span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-white/20 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC509] to-amber-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
          
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#FFC509] text-black rounded-2xl">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase">Direct Signal</h3>
                <p className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Response time: ~24hrs</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-white/20" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-4 text-white/20" />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <textarea
                required
                rows="6"
                placeholder="How can joyalksdev help you today?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all resize-none placeholder:text-white/20"
              />

              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full bg-[#FFC509] text-black font-black uppercase tracking-widest text-xs py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#FFC509]/10"
              >
                {status === "idle" && <><Send size={16} /> Transmit Message</>}
                {status === "sending" && <><Loader2 size={16} className="animate-spin" /> Uplinking...</>}
                {status === "success" && <>✓ Signal Received</>}
              </button>
            </form>
            
            <p className="mt-8 text-[9px] text-white/20 text-center uppercase tracking-[0.3em] font-black">
              CineMood Support
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;
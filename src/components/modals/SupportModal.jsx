import React, { useState } from "react";
import { HelpCircle, X, Send, MessageSquare, Mail, User, Loader2 } from 'lucide-react';
import api from "../../services/axios"; // Assuming your axios instance is here
import toast from "react-hot-toast";

const SupportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); 
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const toggleModal = (value) => {
    if (value) {
      setIsOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsOpen(false), 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Real API call to your support controller
      const { data } = await api.post('/support/contact', formData);

      if (data.success) {
        setStatus("success");
        toast.success("Transmission Received 🚀");
        
        // Auto-close after success
        setTimeout(() => {
          toggleModal(false);
          setStatus("idle");
          setFormData({ name: "", email: "", message: "" });
        }, 2000);
      }
    } catch (error) {
      setStatus("idle");
      const errorMsg = error.response?.data?.message || "Transmission failed. Check your connection.";
      toast.error(errorMsg);
      console.error("Support Error:", error);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-[9999]">
        <button 
          onClick={() => toggleModal(true)}
          className="group relative flex items-center bg-neutral-900 border border-white/10 px-4 py-3 rounded-full hover:bg-[#FFC509] transition-all duration-500 hover:text-black shadow-2xl"
        >
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:mr-3">
            Help & Support
          </span>
          <HelpCircle size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Backdrop & Modal Container */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
          
          <div 
            className={`absolute inset-0 bg-black/80 transition-all duration-500 ease-out ${
              isAnimating ? "opacity-100 backdrop-blur-xl" : "opacity-0 backdrop-blur-0"
            }`}
            onClick={() => toggleModal(false)}
          />

          <div className={`relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out ${
            isAnimating 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-10"
          }`}>
            
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC509]/10 text-[#FFC509] text-[10px] font-black uppercase tracking-widest mb-4 animate-pulse">
                  <MessageSquare size={12} fill="currentColor" />
                  Support Center
                </div>
                <h3 className="text-3xl font-bold tracking-tighter text-white">
                  How can we <span className="text-[#FFC509]">help?</span>
                </h3>
              </div>
              <button 
                onClick={() => toggleModal(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-white/20" />
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
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
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <textarea
                required
                rows="4"
                placeholder="Technical glitch or just need a movie recommendation?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all resize-none placeholder:text-white/20"
              />

              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full bg-[#FFC509] text-black font-black uppercase tracking-widest text-xs py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === "idle" && <><Send size={16} /> Send Message</>}
                {status === "sending" && <><Loader2 size={16} className="animate-spin" /> Transmitting...</>}
                {status === "success" && <>✓ Message Received</>}
              </button>
            </form>

            <p className="text-[10px] text-white/30 text-center pb-8 px-8 leading-relaxed tracking-widest uppercase font-bold">
              Expect a digital tap on the shoulder via email soon.
            </p>

            <div className="h-1 bg-gradient-to-r from-transparent via-[#FFC509]/40 to-transparent w-full opacity-30" />
          </div>
        </div>
      )}
    </>
  );
};

export default SupportModal;
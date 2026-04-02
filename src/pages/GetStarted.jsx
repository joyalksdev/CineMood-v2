import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginNavbar from "../components/layout/LoginNavbar";
import { useUser } from "../context/UserContext";
import Stepper, { Step } from "../components/ui/Stepper";
import api from "../services/axios"; 
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // for smooth transitions
import { Sparkles, User, CheckCircle2 } from "lucide-react"; // icons for ui

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 16, name: "Animation" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ml", label: "Malayalam" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
];

const GetStarted = () => {
  const navigate = useNavigate();
  const { user, saveUser, loading } = useUser();
  const [name, setName] = useState("");
  const [genres, setGenres] = useState([]);
  const [language, setLanguage] = useState("");
  const [step, setStep] = useState(1);

  if (loading) return null;

  if (!user) {
    navigate("/login");
    return null;
  }

  // push onboarding data to backend
  const handleOnboardingComplete = async () => {
    try {
      const profileData = {
        name: name.trim(),
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${name.trim() || 'default'}`,
        genres: genres,
        language: language,
        onboarded: true
      };

      const response = await api.put("/profile/update", profileData);

      if (response.data.success) {
        saveUser({ ...user, ...profileData });
        toast.success("Welcome to the club! 🍿");
        navigate("/home");
      }
    } catch (err) {
      console.error("Onboarding failed:", err);
      toast.error("failed to save profile. try again.");
    }
  };

  return (
    <>
      <LoginNavbar showGetStarted={false} />
      <main className="min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
        
        {/* background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFC509]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <Stepper
            initialStep={1}
            onStepChange={(s) => setStep(s)}
            isNextDisabled={
              (step === 2 && !name.trim()) || 
              (step === 3 && genres.length === 0) || 
              (step === 4 && !language)
            }
            onFinalStepCompleted={handleOnboardingComplete}
          >
            {/* step 1: intro */}
            <Step>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-[#FFC509]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#FFC509]/20">
                  <Sparkles className="text-[#FFC509]" size={40} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter italic">Cinema Awaits.</h2>
                <p className="text-neutral-500 text-lg">
                  Let’s calibrate your cinematic DNA in a few clicks.
                </p>
              </motion.div>
            </Step>

            {/* step 2: profile name & avatar preview */}
            <Step>
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-neutral-900 rounded-2xl border border-white/5">
                    <User className="text-[#FFC509]" size={24} />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">Identity.</h2>
                </div>

                <div className="flex flex-col items-center gap-6 p-8 bg-neutral-900/50 border border-white/5 rounded-[2.5rem]">
                  {/* live avatar preview */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-[#FFC509]/30 overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/micah/svg?seed=${name.trim() || 'seed'}`} 
                        alt="avatar" 
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#FFC509] text-black p-1.5 rounded-lg shadow-lg">
                      <Sparkles size={14} />
                    </div>
                  </div>

                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:border-[#FFC509] transition-all placeholder:text-white/10"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </Step>

            {/* step 3: genre grid */}
            <Step>
              <div className="space-y-6">
                <h2 className="text-3xl font-black tracking-tight mb-2">Taste Profile.</h2>
                <p className="text-neutral-500 mb-6">Select the vibes you vibe with.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GENRES.map((g) => {
                    const isSelected = genres.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGenres(prev => 
                          isSelected ? prev.filter(id => id !== g.id) : [...prev, g.id]
                        )}
                        className={`group relative p-4 rounded-2xl border transition-all duration-300 text-sm font-bold tracking-tight
                          ${isSelected 
                            ? "bg-[#FFC509] text-black border-[#FFC509] shadow-[0_0_20px_rgba(255,197,9,0.2)]" 
                            : "bg-neutral-900/50 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                          }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Step>

            {/* Step 4: Language Selection (Vocal) */}
            <Step>
              <div className="space-y-4"> 
                {/* reduced vertical spacing to keep it compact */}
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-3xl font-black tracking-tighter">Vocal.</h2>
                  <p className="text-neutral-500 text-xs">Preferred language for your daily feed.</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  {LANGUAGES.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200
                          ${isSelected 
                            ? "bg-transparent border-[#FFC509] text-[#FFC509]" 
                            : "bg-neutral-900/40 border-white/5 text-neutral-400 hover:border-white/10"
                          }`}
                      >
                        <span className="font-bold text-sm tracking-tight">
                          {l.label}
                        </span>
                        
                        {/* selection indicator matching your screenshot */}
                        {isSelected && (
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#FFC509]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFC509]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* no extra buttons here - handled by the main Stepper footer */}
              </div>
            </Step>

            {/* step 5: final confirmation */}
            <Step>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                  <CheckCircle2 className="text-green-500" size={48} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter italic mb-4">
                  Systems Ready, <span className="text-[#FFC509]">{name}!</span>
                </h2>
                <p className="text-neutral-500 text-lg">
                  Click below to enter your personalized CineMood dashboard.
                </p>
              </motion.div>
            </Step>
          </Stepper>
        </div>
      </main>
    </>
  );
};

export default GetStarted;
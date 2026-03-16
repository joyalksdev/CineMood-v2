import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginNavbar from "../components/layout/LoginNavbar";
import { useUser } from "../context/UserContext";
import Stepper, { Step } from "../components/ui/Stepper";
import api from "../services/axios"; // Use your new axios instance
import toast from "react-hot-toast";

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

  // Handle final submission to your Node.js backend
  const handleOnboardingComplete = async () => {
    try {
      const profileData = {
        name: name.trim(),
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${name.trim()}`,
        genres: genres,
        language: language,
        onboarded: true
      };

      // Call your backend profile update route
      const response = await api.put("/profile/update", profileData);

      if (response.data.success) {
        // Update local state and storage with the new profile info
        saveUser({ ...user, ...profileData });
        toast.success("Profile ready!");
        navigate("/home");
      }
    } catch (err) {
      console.error("Onboarding failed:", err);
      toast.error("Failed to save profile. Try again.");
    }
  };

  return (
    <>
      <LoginNavbar showGetStarted={false} />
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
          <Stepper
            initialStep={1}
            onStepChange={(s) => setStep(s)}
            // Disable "Next" if current step requirements aren't met
            isNextDisabled={
              (step === 2 && !name.trim()) || 
              (step === 3 && genres.length === 0) || 
              (step === 4 && !language)
            }
            onFinalStepCompleted={handleOnboardingComplete}
          >
            {/* Step 1: Welcome */}
            <Step>
              <h2 className="heading font-bold text-2xl mb-2">Welcome to CineMood 🎬</h2>
              <p className="text-neutral-400">
                Discover movies that match your taste. Let’s set up your profile in under a minute.
              </p>
            </Step>

            {/* Step 2: Name */}
            <Step>
              <h2 className="heading font-bold text-xl sm:text-2xl md:text-3xl mb-2">What should we call you?</h2>
              <p className="text-neutral-400">This name will appear on your profile and watchlist.</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-4 w-full py-3 px-4 rounded-xl border bg-neutral-900 outline-none
                ${!name.trim() && step === 2 ? "border-red-500" : "border-neutral-700 focus:border-[#FFC509]"}`}
                placeholder="Display Name"
              />
            </Step>

            {/* Step 3: Genres */}
            <Step>
              <h2 className="heading font-bold text-xl sm:text-2xl md:text-3xl mb-2">What do you love watching?</h2>
              <p className="text-neutral-400">Select at least one genre.</p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGenres(prev => 
                      prev.includes(g.id) ? prev.filter(id => id !== g.id) : [...prev, g.id]
                    )}
                    className={`px-3 py-2 rounded-lg border transition ${
                      genres.includes(g.id) ? "bg-[#FFC509] text-black border-[#FFC509]" : "border-neutral-600 hover:bg-neutral-700"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </Step>

            {/* Step 4: Language */}
            <Step>
              <h2 className="heading font-bold text-xl sm:text-2xl md:text-3xl mb-2">Preferred Language</h2>
              <p className="text-neutral-400">Which language do you mostly watch movies in?</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      language === l.code ? "bg-[#FFC509] text-black border-[#FFC509]" : "border-neutral-600 hover:bg-neutral-700"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </Step>

            {/* Step 5: Final */}
            <Step>
              <h2 className="heading font-bold text-xl sm:text-2xl md:text-3xl mb-2">Welcome to CineMood, {name || "Friend"}!</h2>
              <p className="text-neutral-400">Your personalized movie world is ready.</p>
            </Step>
          </Stepper>
        </div>
      </main>
    </>
  );
};

export default GetStarted;
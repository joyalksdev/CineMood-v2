import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { deleteUserAccount, saveUserProfile } from "../services/profileService";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";
import Meta from "../components/ui/Meta";
import {
  User,
  Shield,
  LogOut,
  Globe,
  AlertTriangle,
  Clapperboard,
  Mail,
  Lock
} from "lucide-react";
import Tooltip from "../components/ui/Tooltip";
import SupportAside from "../components/cards/SupportAside";

const Profile = () => {
  const { user, logout, saveUser } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [genres, setGenres] = useState(user?.genres || []);
  const [language, setLanguage] = useState(user?.language || "");
  const [loading, setLoading] = useState(false);

  // account deletion states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const GENRES = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
  ];

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "ml", label: "Malayalam" },
    { code: "ta", label: "Tamil" },
  ];

  // sync changes to backend and update global user context
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await saveUserProfile({ name, genres, language });
      if (response.success) {
        saveUser(response.user);
        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error("Failed to sync profile");
    } finally {
      setLoading(false);
    }
  };

  // security check before permanent account removal
  const handleDeleteAccount = async () => {
    if (confirmInput !== user?.email) return toast.error("Email mismatch");
    if (!deletePassword) return toast.error("Password required");

    setLoading(true);
    try {
      const response = await deleteUserAccount(deletePassword);
      if (response.success) {
        toast.success("Account permanently wiped");
        logout();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-15 pb-20 px-6 bg-transparent flex justify-center">
      <Meta title="My Profile" />

      {/* grid system for main content and sidebar */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <main className="lg:col-span-8 space-y-12">
          
          {/* header: identity section with real-time pfp change */}
          <header className="flex items-center justify-between border-b border-white/5 pb-10">
            <div className="flex items-center gap-6">
              <div className="relative group">
                {/* REAL-TIME PFP LOGIC: 
                   Uses local 'name' state as the seed. If name is empty, 
                   it falls back to the username or 'Viewer'.
                */}
                <img
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${name || user?.username || 'Viewer'}`}
                  className="w-20 h-20 rounded-2xl bg-neutral-900 border border-white/10 object-cover transition-all duration-500 group-hover:scale-105 shadow-2xl"
                  alt="avatar"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFC509] rounded-full border-4 border-[#020202] animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black italic tracking-tight leading-none text-white">
                  Hey, {name || "Viewer"}
                </h1>
                <p className="text-neutral-500 text-sm mt-2 font-medium tracking-wide">{user?.email}</p>
              </div>
            </div>
            <Tooltip text="Sign Out">
              <button
                onClick={logout}
                className="p-4 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all active:scale-95 border border-white/5 shadow-lg"
              >
                <LogOut size={22} />
              </button>
            </Tooltip>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* general settings section */}
            <section className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#FFC509]">
                  <User size={16} />
                  <h2 className="text-[11px] font-black italic uppercase tracking-[0.2em]">General Info</h2>
                </div>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-12 py-3.5 font-bold outline-none focus:border-[#FFC509]/40 transition-all text-white"
                    placeholder="Display Name"
                  />
                </div>
              </div>

              {/* movie genre preference selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#FFC509]">
                  <Clapperboard size={16} />
                  <h2 className="text-[11px] font-black italic uppercase tracking-[0.2em]">Movie Taste</h2>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {GENRES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() =>
                        setGenres((prev) =>
                          prev.includes(g.id) ? prev.filter((i) => i !== g.id) : [...prev, g.id]
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-[14px] font-bold border transition-all ${
                        genres.includes(g.id)
                          ? "bg-[#FFC509] text-black border-[#FFC509] shadow-[0_0_15px_rgba(255,197,9,0.1)]"
                          : "bg-transparent border-white/5 text-neutral-500 hover:border-white/20"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* language settings for recommendation engine */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-[#FFC509]">
                <Globe size={16} />
                <h2 className="text-[11px] font-black italic uppercase tracking-[0.2em]">Rec Engine</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`p-4 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all text-center ${
                      language === l.code
                        ? "bg-white/10 border-[#FFC509] text-[#FFC509]"
                        : "bg-transparent border-white/5 text-neutral-500 hover:bg-white/[0.02]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-5 bg-[#FFC509] rounded-2xl text-black font-black italic text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,197,9,0.1)]"
          >
            {loading ? <FadeLoader color="black" height={10} width={2} /> : "Save Profile Changes"}
          </button>

          {/* danger zone: account deletion management */}
          <div className="pt-10 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-2 text-red-500/70">
              <Shield size={16} />
              <h2 className="text-[11px] font-black italic uppercase tracking-[0.2em] text-neutral-600">
                Danger Zone
              </h2>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-4 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]"
              >
                Delete Account Permanently
              </button>
            ) : (
              <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-start gap-4 text-red-500">
                  <AlertTriangle size={24} className="shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider">Account Deletion</h3>
                    <p className="text-xs font-medium opacity-70 leading-relaxed mt-1">
                      This will wipe all watchlists and neural data. This action is irreversible.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black italic text-neutral-600 uppercase ml-1 tracking-widest">
                      Type your email: <span className="text-red-500/80 normal-case italic select-all font-bold">{user?.email}</span>
                    </p>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-4 top-3.5 text-neutral-600 group-focus-within:text-red-500 transition-colors" />
                      <input
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-red-500/40 transition-all text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[9px] font-black italic text-neutral-600 uppercase ml-1 tracking-widest">Verify Password</p>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-3.5 text-neutral-600 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-red-500/40 transition-all text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-[2] py-4 bg-red-600 rounded-xl text-white font-black italic text-[11px] uppercase tracking-widest shadow-xl shadow-red-600/10 active:scale-95 transition-all"
                  >
                    Confirm Permanent Wipe
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* secondary support sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
          <SupportAside />
          <div className="px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.3em] text-center">
                Last Sync: {new Date().toLocaleDateString()}
              </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Profile;
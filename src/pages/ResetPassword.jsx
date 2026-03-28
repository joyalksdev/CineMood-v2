import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import Meta from '../components/ui/Meta';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    setStatus("loading");
    try {
      // Note: Backend uses .put('/resetpassword/:resettoken')
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/resetpassword/${token}`, 
        { password },
        { withCredentials: true }
      );

      if (data.success) {
        setStatus("success");
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Meta title="Reset Password" />
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-full bg-[#FFC509]/10 text-[#FFC509] mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-white">Secure your <span className="text-[#FFC509]">Account</span></h2>
          <p className="text-white/40 text-sm mt-2 font-medium">Create a strong new password below.</p>
        </div>

        {status === "success" ? (
          <div className="text-center py-10 animate-in fade-in zoom-in">
             <div className="text-[#FFC509] font-black uppercase tracking-widest text-xs">Password Updated</div>
             <p className="text-white/20 text-[10px] mt-2 italic">Redirecting you to the experience...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            {/* Password Input */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-4 text-white/20" />
              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all placeholder:text-white/20"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-4 text-white/20 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-4 text-white/20" />
              <input
                required
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[#FFC509]/40 transition-all placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#FFC509] text-black font-black uppercase tracking-widest text-xs py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Update Password"}
            </button>
            
            {status === "error" && (
              <p className="text-red-500/80 text-[10px] text-center font-bold tracking-widest uppercase">Link expired or invalid</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
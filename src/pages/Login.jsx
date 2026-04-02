import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/authSchema";
import { loginUser } from "../services/authService";
import { useUser } from "../context/UserContext";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";
import api from "../services/axios";
import Meta from "../components/ui/Meta";
import { Info, Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [restriction, setRestriction] = useState(null);

  const {
    register,
    handleSubmit,
    getValues, 
    formState: { errors },
  } = useForm({ 
    resolver: yupResolver(loginSchema),
    mode: "onChange" 
  });

  const switchToForgotMode = () => {
    const currentTypedEmail = getValues("email");
    setResetEmail(currentTypedEmail || "");
    setIsForgotMode(true);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data.email, data.password);
      if (res.success) {
        saveUser({ ...res.user }, data.remember);
        toast.success("Welcome back! 🎬");
        res.user.onboarded ? navigate("/home") : navigate("/get-started");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message?.toLowerCase() || "";
      if (errorMessage.includes("banned")) {
        setRestriction("banned");
      } else if (errorMessage.includes("suspended")) {
        setRestriction("suspended");
      } else {
        toast.error(err.response?.data?.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error("Please enter your email");
    try {
      setLoading(true);
      const { data } = await api.post('/auth/forgotpassword', { email: resetEmail });
      if (data.success) {
        toast.success("Reset link sent! Check your Gmail. 📧");
        setIsForgotMode(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta title="Login" />
      <main className="min-h-screen flex justify-center items-center px-4 sm:px-6 my-10 bg-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <FadeLoader color="#FFC509" />
            <p className="text-neutral-400 text-sm mt-5 tracking-widest uppercase font-black animate-pulse">
              {isForgotMode ? "Engaging Neural Reset..." : "Authenticating..."}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md border rounded-[2.5rem] border-neutral-800 bg-[#0d0d0d] p-8 sm:p-10 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-500">
            
            {/* RESTRICTION VIEWS (Banned/Suspended) */}
            {restriction ? (
              <div className="w-full text-center py-4">
                <div className="mb-6 flex justify-center">
                   <div className={`p-4 rounded-full ${restriction === 'banned' ? 'bg-red-500/10 border-red-500/20' : 'bg-[#FFC509]/10 border-[#FFC509]/20'}`}>
                      <Info size={40} className={restriction === 'banned' ? 'text-red-500' : 'text-[#FFC509]'} />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                  {restriction === "banned" ? "Access Revoked" : "Suspended"}
                </h2>
                <p className="text-neutral-500 text-sm mt-4 leading-relaxed font-medium">
                  {restriction === "banned" 
                    ? <>Your account has been <span className="text-red-500 text-xs font-bold uppercase tracking-widest">permanently banned</span> due to a violation of our community guidelines.</>
                    : <>Your account is currently under a <span className="text-[#FFC509] text-xs font-bold uppercase tracking-widest">temporary suspension</span>. Check Gmail for details.</>
                  }
                </p>
                {restriction === 'banned' && 
                <p className="text-sm text-white/60 mt-4">Think this is a glitch in the system? <Link to='/help' className="text-white/80 text-sm font-bold text-[#ffe509]">Contact Support</Link></p>
                }
                <button 
                  onClick={() => setRestriction(null)}
                  className="mt-8 bg-neutral-900 border border-white/5 px-6 py-2 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <>
                {/* Header Section */}
                <div className="mb-8 text-center">
                  <div className="inline-flex p-3 rounded-full bg-[#FFC509]/10 text-[#FFC509] mb-4">
                    {isForgotMode ? <Info size={28} /> : <LogIn size={28} />}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white">
                    {isForgotMode ? "Recover" : "Welcome"} <span className="text-[#FFC509]">{isForgotMode ? "Access" : "Back"}</span>
                  </h2>
                  <p className="text-neutral-500 text-sm mt-2">
                    {isForgotMode ? "We'll send a secure link to your Gmail" : "Your cinematic journey continues"}
                  </p>
                </div>

                {isForgotMode ? (
                  /* RECOVERY UI */
                  <form onSubmit={handleForgotPassword} className="w-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="relative group">
                      <Mail size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-12 border border-neutral-800 bg-neutral-900/50 py-3.5 rounded-2xl outline-none focus:border-[#FFC509]/40 text-white transition-all placeholder:text-neutral-700"
                        placeholder="Registered Email"
                      />
                    </div>
                    <button className="bg-[#FFC509] mt-2 py-4 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-[1.02] transition active:scale-95 shadow-[0_0_20px_rgba(255,197,9,0.2)]">
                      Send Reset Link
                    </button>
                    <button onClick={() => setIsForgotMode(false)} type="button" className="text-neutral-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition mt-2">
                      Back to Login
                    </button>
                  </form>
                ) : (
                  /* LOGIN UI */
                  <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                        <input
                          {...register("email")}
                          className={`w-full px-12 border bg-neutral-900/50 py-3.5 rounded-2xl outline-none transition-all placeholder:text-neutral-700 text-white ${errors.email ? "border-red-500/50" : "border-neutral-800 focus:border-[#FFC509]/40"}`}
                          placeholder="Email Address"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-[10px] uppercase font-bold ml-2 tracking-wider animate-in slide-in-from-left-1">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                        <input
                          type="password"
                          {...register("password")}
                          className={`w-full px-12 border bg-neutral-900/50 py-3.5 rounded-2xl outline-none transition-all placeholder:text-neutral-700 text-white ${errors.password ? "border-red-500/50" : "border-neutral-800 focus:border-[#FFC509]/40"}`}
                          placeholder="Password"
                        />
                      </div>
                      {errors.password && <p className="text-red-400 text-[10px] uppercase font-bold ml-2 tracking-wider animate-in slide-in-from-left-1">{errors.password.message}</p>}
                      <div className="flex justify-end mt-1">
                         <button type="button" onClick={switchToForgotMode} className="text-[9px] font-black uppercase tracking-widest text-neutral-600 hover:text-[#FFC509] transition">
                           Forgot password?
                         </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2 ml-1">
                      <input type="checkbox" id="remember" {...register("remember")} className="w-4 h-4 accent-[#FFC509] rounded-md border-neutral-800 bg-neutral-900" />
                      <label htmlFor="remember" className="text-[10px] font-black text-neutral-600 uppercase tracking-widest cursor-pointer select-none">Stay Signed In</label>
                    </div>

                    <button className="bg-[#FFC509] mt-2 py-4 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-[1.02] transition active:scale-95 shadow-[0_0_20px_rgba(255,197,9,0.2)]">
                      Login
                    </button>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-neutral-500">
                        New to CineMood?{" "}
                        <Link to="/register" className="text-white hover:text-[#FFC509] underline transition-colors">
                          Join
                        </Link>
                      </p>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Login;
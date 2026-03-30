import React, { useState } from "react";
import LoginNavbar from "../components/layout/LoginNavbar";
import Footer from "../components/layout/Footer";
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
import { Info } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

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
    const currentTypedEmail = getValues("email"); // Grab whatever is in the login input
    setResetEmail(currentTypedEmail || ""); // Sync it to the recovery state
    setIsForgotMode(true);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginUser(data.email, data.password);
      if (res.success) {
        saveUser({ ...res.user });
        toast.success("Welcome back! 🎬");
        res.user.onboarded ? navigate("/home") : navigate("/get-started");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: SEND GMAIL RESET LINK ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.error("Please enter your email");

    try {
      setLoading(true);
      const { data } = await api.post('/auth/forgotpassword', { 
        email: resetEmail 
      });

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

      <main className="min-h-screen flex justify-center items-center px-4 sm:px-6 my-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 animate-pulse">
            <FadeLoader color="#FFC509" />
            <p className="text-neutral-400 text-sm mt-5 tracking-widest font-bold uppercase">
              {isForgotMode ? "Engaging Neural Reset..." : "Authenticating..."}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md border rounded-[2.5rem] border-neutral-800 bg-[#0d0d0d] p-8 sm:p-12 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
            
            {/* Dynamic Header */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-wide text-white ">
                {isForgotMode ? "Recover Access" : "Welcome Back"}
              </h2>
              <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-widest mt-2">
                {isForgotMode ? "We'll send a secure link to your Gmail" : "Your cinematic journey continues"}
              </p>
            </div>

            {isForgotMode ? (
              /* RECOVERY UI */
              <div className="w-full flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-600 font-black uppercase ml-2 tracking-widest">Target Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="px-5 border border-neutral-800 bg-neutral-900/50 py-4 rounded-2xl outline-none focus:border-[#FFC509] text-white transition-all placeholder:text-neutral-700"
                    placeholder="Enter registered email"
                  />
                </div>
                <button 
                  onClick={handleForgotPassword}
                  className="bg-[#FFC509] py-4 text-black font-black rounded-2xl hover:brightness-110 transition active:scale-95 shadow-[0_0_20px_rgba(255,197,9,0.2)] uppercase text-sm"
                >
                  Send Reset Link
                </button>
                <button 
                  onClick={() => setIsForgotMode(false)}
                  className="text-neutral-600 text-sm hover:text-white transition tracking-wide font-semibold mt-2"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              /* LOGIN UI */
              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col gap-1">
                  <input
                    {...register("email")}
                    className="px-5 border border-neutral-800 bg-neutral-900/50 py-4 rounded-2xl outline-none focus:border-[#FFC509] text-white transition-all placeholder:text-neutral-700"
                    placeholder="Email Address"
                  />
                  {errors.email && <p className="text-red-500 text-[12px] font-medium ml-3 mt-1 flex items-center gap-1"> <Info size={13}/> {errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    {...register("password")}
                    className="px-5 border border-neutral-800 bg-neutral-900/50 py-4 rounded-2xl outline-none focus:border-[#FFC509] text-white transition-all placeholder:text-neutral-700"
                    placeholder="Password"
                  />
                    {errors.password && <p className="text-red-500 text-[12px] font-medium ml-3 mt-1 flex items-center gap-1"> <Info size={13}/> {errors.password.message}</p>}
                  <div className="flex justify-end mt-1">
                     <button 
                       type="button"
                       onClick={switchToForgotMode} // Triggers the sync logic
                       className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 hover:text-[#FFC509] transition underline-offset-4 hover:underline"
                     >
                       Forgot password?
                     </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2 ml-1">
                  <input type="checkbox" id="remember" className="w-4 h-4 accent-[#FFC509] rounded-md border-neutral-800 bg-neutral-900" />
                  <label htmlFor="remember" className="text-[11px] font-bold text-neutral-500 uppercase tracking-tighter cursor-pointer select-none">Stay Signed In</label>
                </div>

                <button className="bg-[#FFC509] py-4 text-black font-black rounded-2xl hover:brightness-110 transition active:scale-95 shadow-[0_0_20px_rgba(255,197,9,0.2)] uppercase text-sm">
                  Login
                </button>

                <div className="h-[1px] w-full bg-neutral-900 my-2" />

                <p className="text-center text-sm text-neutral-400 font-medium  tracking-tighter">
                  New to CineMood?{" "}
                  <Link to="/register" className="text-white hover:text-[#FFC509] transition underline underline-offset-4 ml-1">
                    Create Account
                  </Link>
                </p>
              </form>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Login;
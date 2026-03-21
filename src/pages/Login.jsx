import React, { useState } from "react";
import LoginNavbar from "../components/layout/LoginNavbar";
import Footer from "../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/authSchema";
import { loginUser } from "../services/authService"; // You'll need to add forgotPassword here
import { useUser } from "../context/UserContext";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios"; // Using axios directly for the forgot link
import api from "../services/axios";

const Login = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  // 1. Existing Login Logic
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

  // 2. New Forgot Password Logic
const handleForgotPassword = async (e) => {
  e.preventDefault();
  if (!resetEmail) return toast.error("Please enter your email");

  try {
    setLoading(true);
    const { data } = await api.post('/auth/forgotpassword', { 
      email: resetEmail 
    });

    if (data.success) {
      toast.success("Reset link sent! Check your inbox. 📧");
      setIsForgotMode(false);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "User not found or server error.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <LoginNavbar showGetStarted={false} />
      <main className="min-h-screen flex justify-center items-center px-4 sm:px-6 my-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 animate-pulse">
            <FadeLoader color="#FFC509" />
            <p className="text-neutral-400 text-sm mt-5 tracking-widest font-bold">
              {isForgotMode ? "Sending Link..." : "Signing you in..."}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md border rounded-[2rem] border-neutral-800 bg-[#0d0d0d] p-8 sm:p-10 flex flex-col items-center shadow-2xl transition-all duration-500">
            
            {/* Dynamic Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white">
                {isForgotMode ? "Recover Account" : "Welcome Back"}
              </h2>
              <p className="text-neutral-500 text-sm mt-2">
                {isForgotMode ? "Enter email to receive a magic link" : "Continue your movie journey"}
              </p>
            </div>

            {isForgotMode ? (
              /* Forgot Password Form */
              <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="px-4 border border-neutral-800 bg-neutral-900/50 py-3 rounded-xl outline-none focus:border-[#FFC509] text-white transition-all"
                  placeholder="name@example.com"
                />
                <button 
                  onClick={handleForgotPassword}
                  className="bg-[#FFC509] py-3 text-black font-bold rounded-xl hover:scale-[1.02] transition active:scale-95"
                >
                  Send Reset Link
                </button>
                <button 
                  onClick={() => setIsForgotMode(false)}
                  className="text-neutral-500 text-xs hover:text-white transition uppercase tracking-widest font-bold"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              /* Standard Login Form */
              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col gap-1">
                  <input
                    {...register("email")}
                    className="px-4 border border-neutral-800 bg-neutral-900/50 py-3 rounded-xl outline-none focus:border-[#FFC509] text-white transition-all"
                    placeholder="Email"
                  />
                  <p className="text-red-400 text-[10px] uppercase font-bold ml-2">{errors.email?.message}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="password"
                    {...register("password")}
                    className="px-4 border border-neutral-800 bg-neutral-900/50 py-3 rounded-xl outline-none focus:border-[#FFC509] text-white transition-all"
                    placeholder="Password"
                  />
                  <div className="flex justify-between items-center mt-1 px-1">
                     <button 
                       type="button"
                       onClick={() => setIsForgotMode(true)}
                       className="text-[11px] text-neutral-500 hover:text-[#FFC509] transition hover:underline"
                     >
                       Forgot password?
                     </button>
                  </div>
                  <p className="text-red-400 text-[10px] uppercase font-bold ml-2">{errors.password?.message}</p>
                </div>

                <div className="flex items-center gap-2 mb-2 ml-1">
                  <input type="checkbox" id="remember" className="accent-[#FFC509] rounded" />
                  <label htmlFor="remember" className="text-xs text-neutral-400 select-none">Remember me</label>
                </div>

                <button className="bg-[#FFC509] py-3 text-black font-bold rounded-xl hover:scale-[1.02] transition active:scale-95">
                  Login
                </button>

                <p className="text-center text-sm text-neutral-500 mt-4">
                  New to CineMood?{" "}
                  <Link to="/register" className="text-white hover:text-[#FFC509] underline transition">
                    Register
                  </Link>
                </p>
              </form>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Login;
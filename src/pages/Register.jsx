import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validations/authSchema";
import { registerUser } from "../services/authService";
import { useUser } from "../context/UserContext";
import { FadeLoader } from "react-spinners";
import { Mail, Lock, UserPlus } from "lucide-react"; 
import toast from "react-hot-toast";
import Meta from "../components/ui/Meta";

const Register = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur", // Validates when user leaves the field
  });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        saveUser(response.user);
        toast.success("Welcome to CineMood! 🍿");
        navigate("/get-started");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta title="Join CineMood" />
      <main className="min-h-screen flex justify-center items-center px-4 sm:px-6 my-10 bg-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <FadeLoader color="#FFC509" />
            <p className="text-neutral-400 text-sm mt-5 tracking-widest uppercase font-black animate-pulse">
              Creating your account...
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md border rounded-[2.5rem] border-neutral-800 bg-[#0d0d0d] p-8 sm:p-10 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-500">
            
            {/* Header Section */}
            <div className="mb-8 text-center">
              <div className="inline-flex p-3 rounded-full bg-[#FFC509]/10 text-[#FFC509] mb-4">
                <UserPlus size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-white">
                Join <span className="text-[#FFC509]">CineMood</span>
              </h2>
              <p className="text-neutral-500 text-sm mt-2">
                Start your personalized movie journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
              
              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                  <input
                    {...register("email")}
                    autoComplete="email"
                    className={`w-full px-12 border bg-neutral-900/50 py-3.5 rounded-2xl outline-none transition-all placeholder:text-neutral-700 text-white ${
                      errors.email ? "border-red-500/50" : "border-neutral-800 focus:border-[#FFC509]/40"
                    }`}
                    placeholder="Email Address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-[10px] uppercase font-bold ml-2 tracking-wider animate-in slide-in-from-left-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                  <input
                    type="password"
                    {...register("password")}
                    autoComplete="new-password"
                    className={`w-full px-12 border bg-neutral-900/50 py-3.5 rounded-2xl outline-none transition-all placeholder:text-neutral-700 text-white ${
                      errors.password ? "border-red-500/50" : "border-neutral-800 focus:border-[#FFC509]/40"
                    }`}
                    placeholder="Create Password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-[10px] uppercase font-bold ml-2 tracking-wider animate-in slide-in-from-left-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-4 text-neutral-600 group-focus-within:text-[#FFC509] transition-colors" />
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    autoComplete="new-password"
                    className={`w-full px-12 border bg-neutral-900/50 py-3.5 rounded-2xl outline-none transition-all placeholder:text-neutral-700 text-white ${
                      errors.confirmPassword ? "border-red-500/50" : "border-neutral-800 focus:border-[#FFC509]/40"
                    }`}
                    placeholder="Confirm Password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-[10px] uppercase font-bold ml-2 tracking-wider animate-in slide-in-from-left-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#FFC509] mt-2 py-4 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-[1.02] transition active:scale-95 disabled:opacity-50"
              >
                Create Account
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-white hover:text-[#FFC509] underline transition-colors">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default Register;
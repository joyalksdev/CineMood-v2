import React, { useState } from "react";
import LoginNavbar from "../components/layout/LoginNavbar";
import Footer from "../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/authSchema";
import { loginUser } from "../services/authService";
import { useUser } from "../context/UserContext";
import { getUserProfile } from "../services/profileService";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await loginUser(data.email, data.password);

      if (res.success) {
    
        const userData = {
          ...res.user,
        };

        saveUser(userData);

        toast.success("Welcome back! 🎬");

        if (res.user.onboarded) {
          navigate("/home");
        } else {
          navigate("/get-started");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginNavbar showGetStarted={false} />
      <main className="min-h-screen flex justify-center items-center px-4 sm:px-6 my-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <FadeLoader
              className="mx-auto mb-5"
              color="#FFC509"
              radius={-5}
              speedMultiplier={1}
              width={4}
              loading
            />
            <p className="text-neutral-400 text-sm">Signing you in...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm sm:max-w-md border rounded-2xl border-neutral-500 bg-[#1b1b1b] p-6 sm:p-10 flex flex-col items-center"
          >
            <div className="mb-5 flex flex-col gap-3 ">
              <h2 className="text-center text-xl sm:text-xl md:text-2xl max-w-xs font-bold heading">
                Welcome back to <br /> CineMood 🎬
              </h2>
              <p className="text-neutral-300 font-medium">
                Continue your movie journey
              </p>
            </div>

            <div className="flex flex-col w-full max-w-70 gap-2 ">
              <input
                {...register("email")}
                className="px-3 border border-neutral-700 py-2  rounded-lg outline-none focus:border-[#FFC509]"
                placeholder="Email"
              />
              <p className="text-red-400 text-sm">{errors.email?.message}</p>

              <input
                type="password"
                {...register("password")}
                className="px-3 border border-neutral-700 py-2 rounded-lg outline-none focus:border-[#FFC509]"
                placeholder="Password"
              />

              <span className="text-left w-full text-neutral-300 hover:text-white transition hover:underline">
                <Link to="/forgot">Forgot password?</Link>
              </span>
              <p className="text-red-400 text-sm">{errors.password?.message}</p>

              <div className="flex items-center gap-1">
                <input type="checkbox" id="" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button className="bg-[#FFC509] px-3 py-2 text-black rounded-lg hover:bg-amber-300 cursor-pointer transition ease-in">
                Login
              </button>
            </div>
            <p className="mt-3">
              New to CineMood?{" "}
              <Link to="/register" className="underline hover:no-underline">
                Register
              </Link>
            </p>

            {/* <span className="relative  border border-neutral-500 w-full max-w-70 mt-7"></span>
            <p className="relative -top-3.5 px-2 bg-[#1b1b1b]">or</p>
          
            <div className="mt-3">
              <button
                onClick={handleGoogle}
                className="py-2 px-5 flex items-center gap-2 border cursor-pointer hover:bg-neutral-800/70 transition ease-in border-neutral-500 rounded-lg  w-full bg-neutral-800"
              >
                <FcGoogle size={23} />
                Continue with Google
              </button>
            </div> 
             */}
          </form>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Login;

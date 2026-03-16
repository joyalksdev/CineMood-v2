import React, { useState } from "react";
import LoginNavbar from "../components/layout/LoginNavbar";
import Footer from "../components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validations/authSchema";
import { registerUser } from "../services/authService";
import { useUser } from "../context/UserContext";
import { saveUserProfile } from "../services/profileService";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        // Save ONLY user info to context
        saveUser(response.user);

        toast.success("Welcome to CineMood!");
        navigate("/get-started");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginNavbar showGetStarted={false} />
      <main className="min-h-screen flex justify-center items-center px-6 my-13">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 w-full max-w-sm">
            <FadeLoader
              className="mx-auto mb-5"
              color="#FFC509"
              radius={-5}
              speedMultiplier={1}
              width={4}
              loading
            />
            <p className="text-neutral-400 text-sm">
              Creating your CineMood account...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm sm:max-w-md border rounded-2xl border-neutral-500 bg-[#1b1b1b] p-6 sm:p-10 flex flex-col items-center"
          >
            <div className="mb-5 flex flex-col gap-3 ">
              <h2 className="text-center text-xl sm:text-xl md:text-2xl max-w-xs font-bold heading">
                Create your CineMood account
              </h2>
              <p className="text-[#aaaaaa] font-medium text-sm text-center">
                Step into your movie journey
              </p>
            </div>

            <div className="flex flex-col w-full max-w-70 gap-2 ">
              <p className="text-red-400 text-sm">{errors.username?.message}</p>

              <input
                type="email"
                {...register("email")}
                className="px-3 border border-neutral-700 py-2 rounded-lg outline-none focus:border-[#FFC509]"
                placeholder="Email"
              />

              <input
                type="password"
                {...register("password")}
                className="px-3 border border-neutral-700 py-2 rounded-lg outline-none focus:border-[#FFC509]"
                placeholder="Password"
              />
              <p className="text-red-400 text-sm">{errors.password?.message}</p>

              <input
                type="password"
                {...register("confirmPassword")}
                className="px-3 border border-neutral-700 py-2 rounded-lg outline-none focus:border-[#FFC509]"
                placeholder="Confrim Password"
              />
              <p className="text-red-400 text-sm">
                {errors.confirmPassword?.message}
              </p>

              <button
                disabled={loading}
                className={`bg-[#FFC509] mt-3 px-3 py-2 font-semibold rounded-lg text-black
                    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-amber-300"}`}
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>
            <p className="mt-3">
              Already have an account?{" "}
              <Link to="/login" className="underline hover:no-underline">
                Login
              </Link>
            </p>
              {/* Commented Google login */}
            {/*  <span className='relative  border border-neutral-500 w-full mt-7'></span>
                  <p className='relative -top-3.5 px-2 bg-[#1b1b1b]'>or</p>

                 <div className='mt-3'>
                  <button onClick={handleGoogle}
                    disabled={loading}
                    className={`py-2 px-5 flex items-center gap-2  cursor-pointer transition ease-in rounded-lg w-full bg-neutral-800
                    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-neutral-700"}`}>
                    <FcGoogle size={23} />Continue with Google</button>
                </div> */}
          </form>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Register;

import React from "react";
import { Link } from "react-router-dom";
import FuzzyText from "../components/ui/FuzzyText";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-6 text-center">
        <FuzzyText fps={80} transitionDuration={10} fontSize="22px">
          This scene doesn’t exist
        </FuzzyText>

        <FuzzyText fps={80} transitionDuration={10} fontSize="10vw" clickEffect>
          404
        </FuzzyText>

        <p className="text-gray-400 max-w-md">
          The page you're looking for has vanished into the cinematic void.
          Let’s get you back to something worth watching.
        </p>

        <Link
          to="/home"
          className="mt-4 px-6 py-3 rounded-full bg-neutral-600 border border-neutral-300 hover:bg-[#FFC509] hover:text-black transition text-white font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

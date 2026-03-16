import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IoLanguage } from "react-icons/io5";
import { useUser } from "../../context/UserContext";

const LoginNavbar = ({ showGetStarted = true }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Function to trigger translation to Hindi
  const translateToHindi = () => {
  const iframe = document.querySelector("iframe.goog-te-menu-frame");
  if (!iframe) {
    alert("Translator still loading. Please try again.");
    return;
  }

  const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  const items = innerDoc.querySelectorAll(".goog-te-menu2-item span.text");

  for (let item of items) {
    if (item.innerText === "Hindi") {
      item.click();
      break;
    }
  }
};


  return (
    <nav className="fixed top-0 left-0 md:w-full w-full lg:w-full sm:w-full z-50 bg-linear-to-b from-black/90 to-transparent backdrop-blur-md px-10 py-5 flex items-center text-white justify-between">
      <Link to="/">
        <div className="text-[25px] heading flex gap-3 items-center ">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <h2 className="font-medium">
            <span className="text-[#FFC509] font-bold m-0">Cine</span>Mood
          </h2>
        </div>
      </Link>

      <div className="flex gap-3">
        {showGetStarted && (
          <button
            className="px-3 py-1 bg-[#FFC509] rounded-lg text-black hover:bg-amber-300"
            onClick={() => navigate(user ? "/home" : "/get-started")}
          >
            Get Started
          </button>
        )}

        <div className="px-3 py-1 gap-1 hidden md:flex items-center border border-neutral-600 rounded-lg">
          <IoLanguage className="size-5" />

          <select
            className="outline-none bg-transparent"
            onChange={(e) => {
              if (e.target.value === "hi") translateToHindi();
            }}
          >
            <option className="bg-neutral-800" value="en">English</option>
            <option className="bg-neutral-800" value="hi">Hindi</option>
          </select>
        </div>

      </div>
    </nav>
  );
};

export default LoginNavbar;

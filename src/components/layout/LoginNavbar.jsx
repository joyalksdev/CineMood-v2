import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IoLanguage } from "react-icons/io5";
import { useUser } from "../../context/UserContext";

const LoginNavbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const hidePaths = ["/login", "/register", "/get-started"];
  const shouldShowGetStarted = !hidePaths.includes(location.pathname);

  // Initialize Google Translate only once when Navbar mounts
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
        
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false
          }, 'google_translate_element');
        };
      }
    };

    addGoogleTranslateScript();
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    
    const triggerTranslation = () => {
      // Look for Google's internal dropdown
      const googleCombo = document.querySelector(".goog-te-combo");
      if (googleCombo) {
        googleCombo.value = lang;
        googleCombo.dispatchEvent(new Event("change"));
      } else {
        console.warn("Google Translate widget not ready yet.");
      }
    };

    triggerTranslation();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md px-6 md:px-10 py-5 flex items-center text-white justify-between">
      {/* Hidden container for Google's script to work with */}
      <div id="google_translate_element" className="hidden"></div>

      <Link to="/" className="hover:opacity-80 transition-opacity">
        <div className="text-[25px] heading flex gap-3 items-center">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <h2 className="font-medium tracking-tight">
            <span className="text-[#FFC509] font-bold">Cine</span>Mood
          </h2>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {shouldShowGetStarted && (
          <button
            className="px-5 py-2 bg-[#FFC509] rounded-lg text-black font-bold text-sm hover:bg-amber-300 transition-all active:scale-95"
            onClick={() => navigate(user ? "/home" : "/get-started")}
          >
            Get Started
          </button>
        )}

        <div className="px-3 py-1.5 gap-2 hidden md:flex items-center border border-white/10 bg-white/5 rounded-lg hover:border-[#FFC509]/40 transition-colors">
          <IoLanguage className="text-[#FFC509] size-5" />
          <select
            className="outline-none bg-transparent text-xs font-bold uppercase tracking-widest cursor-pointer appearance-none"
            onChange={handleLanguageChange}
            defaultValue="en"
          >
            <option className="bg-neutral-900 text-white" value="en">English</option>
            <option className="bg-neutral-900 text-white" value="hi">Hindi</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default LoginNavbar;
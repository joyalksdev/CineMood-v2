import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // If Lenis is active, we should tell it to scroll to top
    // but window.scrollTo(0,0) usually works if Lenis is synced
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
import React from 'react';
import { Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Navbar from "./Navbar"; // Your main app Navbar
import LoginNavbar from "./LoginNavbar"; // Your guest Navbar
import Footer from "./Footer"; 
import SupportModal from '../modals/SupportModal';

const PublicLayout = () => {
  const { user } = useUser();

  return (
    <div className="bg-[#020202] min-h-screen flex flex-col">
      {/* Dynamic Navbar based on Auth State */}
      {user ? (
        <Navbar />
      ) : (
        <LoginNavbar showGetStarted={true} />
      )}
      
      <main className="flex-grow">
        <Outlet /> 
      </main>
        <SupportModal/>
      <Footer />
    </div>
  );
};

export default PublicLayout;
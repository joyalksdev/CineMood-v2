import React from 'react';
import { Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Navbar from "./Navbar"; 
import LoginNavbar from "./LoginNavbar"; 
import Footer from "./Footer"; 
import SupportModal from '../modals/SupportModal';

const PublicLayout = () => {
  // get user data to check if logged in
  const { user } = useUser();

  return (
    // flex-col keeps footer at the bottom
    <div className="bg-[#020202] min-h-screen flex flex-col">
      {/* swap navbar based on login status */}
      {user ? (
        <Navbar />
      ) : (
        <LoginNavbar showGetStarted={true} />
      )}
      
      {/* where the main page content shows up */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      {/* global support modal and footer */}
      <SupportModal/>
      <Footer />
    </div>
  );
};

export default PublicLayout;
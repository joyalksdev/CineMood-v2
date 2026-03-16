import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const RootLayout = () => {
  return (
    <div className='min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white'>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Main content area */}
        <main className='flex-grow px-0 lg:px-10'>
          <Outlet />
        </main>
        
        <Footer />
      </div>

      {/* Optional: Subtle ambient glow in the background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFC509]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#FFC509]/5 blur-[100px] rounded-full"></div>
      </div>
    </div>
  )
}

export default RootLayout
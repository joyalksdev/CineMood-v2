import React from 'react'
import Hero from '../components/sections/Hero'
import SpotlightCard from '../components/ui/SpotlightCard'
import { RiShiningFill } from "react-icons/ri";
import { ImFire } from "react-icons/im";
import { PiFilmSlateFill } from "react-icons/pi";
import { useUser } from '../context/UserContext'
import AboutSection from '../components/sections/AboutSection'
import DeveloperSpotlight from '../components/sections/DeveloperSpotlight' // Import the new section

const Landing = () => {
  const { user, loading } = useUser()

  return (
    <main className='min-h-screen px-4 md:px-10 pt-22 bg-black'>
      {/* Hero Section */}
      <Hero />

      {/* Feature Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16'>
        <SpotlightCard spotlightColor="#ceb04f">
          <div className='p-6'>
            <RiShiningFill className='size-10 text-[#FFC509]'/>
          </div>
          <div className="p-6 flex flex-col gap-2 text-white">
            <span className="text-[#FFC509] text-sm tracking-wider uppercase font-bold">Just For You</span>
            <h3 className="text-2xl font-black tracking-tight">Smart Recommendations</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Neural Engine v2.0 parses your cinematic DNA to find your perfect match.
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="#ceb04f">
          <div className='p-6'>
            <PiFilmSlateFill className='size-10 text-[#FFC509]'/>
          </div>
          <div className="p-6 flex flex-col gap-2 text-white">
            <span className="text-[#FFC509] text-sm tracking-wider uppercase font-bold">Explore More</span>
            <h3 className="text-2xl font-black tracking-tight">Deep Metadata</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Powered by TMDB for real-time trailers, cast insights, and global ratings.
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="#ceb04f">
          <div className='p-6'>
            <ImFire className='size-10 text-[#FFC509]'/>
          </div>
          <div className="p-6 flex flex-col gap-2 text-white">
            <span className="text-[#FFC509] text-sm tracking-wider uppercase font-bold">Hot Picks</span>
            <h3 className="text-2xl font-black tracking-tight">Global Trends</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay in the loop with what the world is watching right now.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* About Section - Explains the MERN + AI magic */}
      <AboutSection />

      {/* Developer Spotlight - Redirects to your contact/socials */}
      <DeveloperSpotlight />
    </main>
  )
}

export default Landing
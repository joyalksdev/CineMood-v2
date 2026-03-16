import React from 'react'
import Footer from '../components/layout/Footer'
import LoginNavbar from '../components/layout/LoginNavbar'
import Hero from '../components/sections/Hero'
import SpotlightCard from '../components/ui/SpotlightCard'
import { RiShiningFill } from "react-icons/ri";
import { ImFire } from "react-icons/im";
import { PiFilmSlateFill } from "react-icons/pi";
import { useUser } from '../context/UserContext'

const Landing = () => {

  const {user,loading} = useUser()

  return (
    <>
    <LoginNavbar />
        <main className='min-h-screen  px-6 pt-22'>
            
        <Hero />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
  
            <SpotlightCard spotlightColor="#ceb04f">
              <div className='p-6'>
                <RiShiningFill className='size-10'/>
              </div>
              <div className="p-6 flex flex-col gap-2 text-white">
               <span className="text-[#FFC509] text-sm tracking-wider uppercase">Just For You</span>
               <h3 className="text-2xl heading font-semibold">Smart Recommendations</h3>
                <p className="text-gray-400">
                  Movies picked for your mood and taste.
                </p>
                
              </div>
            </SpotlightCard>
  
            <SpotlightCard spotlightColor="#ceb04f">
              <div className='p-6'>
                <PiFilmSlateFill className='size-10'/>
              </div>
              <div className="p-6 flex flex-col gap-2 text-white">
               <span className="text-[#FFC509] text-sm tracking-wider uppercase">Explore More</span>
               <h3 className="text-2xl heading font-semibold">Everything About a Movie</h3>
                <p className="text-gray-400">
                  Cast, trailers, genres, and real ratings.
                </p>
                
              </div>
            </SpotlightCard>
  
            <SpotlightCard spotlightColor="#ceb04f">
              <div className='p-6'>
                <ImFire className='size-10'/>
              </div>
              <div className="p-6 flex flex-col gap-2 text-white">
               <span className="text-[#FFC509] text-sm tracking-wider uppercase">Hot Picks</span>
               <h3 className="text-2xl heading font-semibold">What Everyone’s Watching</h3>
                <p className="text-gray-400">
                  Discover the most popular movies right now.
                </p>
                
              </div>
            </SpotlightCard>
            
          </div>
            
        </main>
    <Footer />
    </>
  )
}

export default Landing
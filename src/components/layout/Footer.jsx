import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { Github, Twitter, Instagram, Mail, Linkedin } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-transparent border-t border-white/10 mt-20 w-full pt-16 pb-8 px-8 flex flex-col items-center backdrop-blur-sm'>
      <div className='max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 items-start'>

        {/* Brand Section */}
        <div className='flex flex-col gap-4'>
          <Link to='/'>
            <div className='text-3xl flex gap-3 items-center group'>
              <img src={logo} alt="Logo" className='h-10 w-auto' />
              <h2 className='font-medium tracking-tight text-white'>
                <span className='text-[#FFC509] font-bold'>Cine</span>Mood
              </h2>         
            </div>
          </Link>
          <p className='text-neutral-400 leading-relaxed text-sm max-w-xs'>
            Discover cinema the way it was meant to be explored. Your personal space to find, save, and fall in love with movies again.
          </p>
          
          {/* Social Icons - Simple Way */}
          <div className='flex gap-4 mt-2'>
            <a href="https://github.com/joyalksdev" target='_blank' className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:bg-[#FFC509] hover:text-black transition-all">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/joyalks" target='_blank' className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:bg-[#FFC509] hover:text-black transition-all">
              <Linkedin size={18} />
            </a>
            <a href="https://www.instagram.com/joyalks.dev" target='_blank' className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:bg-[#FFC509] hover:text-black transition-all">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className='flex flex-col gap-3'>
          <h3 className='text-white font-bold text-lg mb-1'>Explore</h3>
          <Link to='/movies/trending' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Trending</Link>
          <Link to='/movies/top_rated' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Top Rated</Link>
          <Link to='/browse' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Genres</Link>
          <Link to='/watchlist' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">My Watchlist</Link>
        </div>

        {/* Support Links */}
        <div className='flex flex-col gap-3'>
          <h3 className='text-white font-bold text-lg mb-1'>Support</h3>
          <Link to='/help' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">FAQ</Link>
          <Link to='/help' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Help Centre</Link>
          <Link to='/contact' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Contact Developer</Link>
        </div>

        {/* Legal Links */}
        <div className='flex flex-col gap-3'>
          <h3 className='text-white font-bold text-lg mb-1'>Legal</h3>
          <Link to='/legal#privacy' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Privacy Policy</Link>
          <Link to='/legal#terms' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Terms & Conditions</Link>
          <Link to='/legal#cookies' className="text-neutral-400 text-sm hover:text-[#FFC509] transition-colors">Cookie Policy</Link>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className='w-full max-w-7xl border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500'>
        <p>&copy; 2026 CineMood. All rights reserved.</p>
        <div className='flex gap-6'>
          <span>Status: Operational</span>
          <span>v2.0.4</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
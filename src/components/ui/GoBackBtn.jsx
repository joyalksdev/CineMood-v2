import { ChevronLeft } from 'lucide-react' // Lucide uses ChevronLeft
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const GoBackBtn = () => {
    const navigate = useNavigate()
    
    return (
        <button 
            className="group px-4 py-2 my-5 flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-[#FFC509]/50 hover:bg-[#FFC509]/5 text-neutral-400 hover:text-[#FFC509]" 
            onClick={() => navigate(-1)}
        >
            <ChevronLeft 
                className="transition-transform duration-300 group-hover:-translate-x-1" 
                size={20} 
            /> 
            <span className="text-sm font-bold tracking-wide">Go Back</span>
        </button>
    ) 
}

export default GoBackBtn
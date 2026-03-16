import { ChevronLeftIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const GoBackBtn = () => {
    const navigate = useNavigate()
  return (
    
    <button className="px-4 py-2 my-5 flex items-center  rounded-lg bg-neutral-800 border cursor-pointer  border-neutral-700 hover:border-yellow-500" 
      onClick={() => navigate(-1)}>
      <ChevronLeftIcon className="text-white group-hover:text-black" size={24} /> Go Back
    </button>
    
  ) 
}

export default GoBackBtn
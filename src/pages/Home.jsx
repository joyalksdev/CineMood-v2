import React from 'react'
import { useUser } from '../context/UserContext'
import RecommendationCard from '../components/cards/RecommendationCard'
import MovieRow from '../components/cards/MovieRow'
import { 
  fetchTrendingMovies, 
  fetchTopRatedMovies, 
  fetchNowPlayingMovies, 
  fetchPopularAnime,
  fetchPopularMovies, 
  fetchPopularKDramas  
} from '../services/tmbdApi'
import MoodMatcher from '../components/sections/MoodMatcher'

const Home = () => {
  const { user } = useUser()

  return (
    <div className='px-6 lg:px-10 pb-20 pt-24'>
      {/* 1. Cinematic Greeting Section */}
      <div className='flex flex-col justify-center items-center py-16 gap-2'>
        <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight text-center'>
          Welcome back, <span className='text-[#FFC509]'>{user?.name}</span> 👋
        </h2>
        <p className='text-neutral-400 text-lg md:text-xl text-center max-w-2xl'>
          Ready to find your next favorite movie? Your mood. Your movies. <span className='text-white font-medium'>Your CineMood.</span>
        </p>
      </div> 
      
      {/* 2. Main Content Sections */}
      <section className='flex flex-col gap-16'>

        <RecommendationCard />
        
        <MovieRow rowId="trending" title="🔥 Trending Now" fetchFn={fetchTrendingMovies} /> 
        
        <MoodMatcher />
        
        <div className='flex flex-col gap-12'>
          <MovieRow rowId="top_rated" title="🏆 Top Rated Masterpieces" fetchFn={fetchTopRatedMovies} />
          <MovieRow rowId="now_playing" title="🎬 In Theatres" fetchFn={fetchNowPlayingMovies}/>
          <MovieRow rowId="popular_movies" title="🍿 Blockbuster Hits" fetchFn={fetchPopularMovies} />
          <MovieRow rowId="popular_kdrama" title="🇰🇷 K-Drama Wave" fetchFn={fetchPopularKDramas} />
          <MovieRow rowId="popular_anime" title="🍥 Anime Essentials" fetchFn={fetchPopularAnime} />
        </div>
                
      </section>
    </div>
  )
}

export default Home
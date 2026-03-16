import api from "./axios";

export const fetchPersonalizedMovies = () =>
  api.get("/movies/personalized").then((res) => res.data);

export const fetchBrowseMovies = (filters) =>
  api.get("/movies/browse", { params: filters }).then((res) => res.data);

export const fetchTopRatedMovies = () =>
  api.get("/movies/top-rated").then((res) => res.data);

export const fetchPopularMovies = () =>
  api.get("/movies/popular").then((res) => res.data);

export const fetchNowPlayingMovies = () =>
  api.get("/movies/now-playing").then((res) => res.data);

export const fetchPopularKDramas = () =>
  api.get("/movies/kdrama").then((res) => res.data);

export const fetchPopularAnime = () =>
  api.get("/movies/anime").then((res) => res.data);

export const fetchTrendingMovies = () =>
  api.get("/movies/trending").then((res) => res.data);
  

export const searchMulti = (query) =>
  api.get("/movies/search", { params: { query } }).then((res) => res.data);

export const fetchMovieDetails = (id) =>
  api.get(`/movies/${id}`).then((res) => res.data);

export const fetchSimilarMovies = (id) =>
  api.get(`/movies/${id}/similar`).then((res) => res.data);

export const searchMovies = (query) => 
  api.get("/movies/search/movies", { params: { query } }).then(res => res.data);

export const searchPeople = (query) => 
  api.get("/movies/search/people", { params: { query } }).then(res => res.data);

export const fetchPersonDetails = (id) => 
  api.get(`/movies/person/${id}`).then(res => res.data);

export const fetchMovieCredits = (id) => 
  api.get(`/movies/${id}/credits`).then(res => res.data);

export const fetchMovieReviews = (id, page = 1) => 
  api.get(`/movies/${id}/reviews`, { params: { page } }).then(res => res.data);

export const discoverByGenre = (genres, page = 1) => 
  api.get("/movies/discover", { params: { genres, page } }).then(res => res.data);

export const searchByMoodKeyword = (keyword, page = 1) => 
  api.get("/movies/mood", { params: { keyword, page } }).then(res => res.data);
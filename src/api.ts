const API_KEY = "1426d684e668c16f1dd1ef0f6bdace0b";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genre_ids: [];
}

interface IGenre {
  id: number;
  name: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMovieDetailResult {
  original_title: string;
  genres: IGenre[];
  runtime: number;
  backdrop_path: string;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
}

export interface ITV {
  backdrop_path: string;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  id: number;
}

export interface IGetTv {
  results: ITV[];
}
export interface IGetTvTop {
  results: ITV[];
}

export interface TvDetails {
  adult: false;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: [];
  id: number;
  name: string;
  origin_country: [];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  last_episode_to_air: {
    episode_number: number;
  };
  genres: IGenre[];
}

export interface ISearch {
  keyword: string;
}

export function getMovie() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function getMovieDetails(id: string) {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getUpcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function getTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function getTv() {
  return fetch(
    `${BASE_PATH}/trending/tv/day?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getTvTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function getTvDetails(id: string) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getTvPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function searchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&include_adult=false&language=ko&page=1`
  ).then((response) => response.json());
}

export function searchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}&include_adult=false&language=ko&page=1`
  ).then((response) => response.json());
}

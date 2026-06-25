import type { TMDBMovieRaw, TMDBMovieListRawResponse, Movie, MovieListResponse } from '@/types/movie.types';

/**
 * 转换单条原始电影数据，实施严格的 Null 及空值防御
 */
export function transformMovie(raw: TMDBMovieRaw): Movie {
  const imageBase = import.meta.env.VITE_TMDB_IMAGE_BASE ?? 'https://image.tmdb.org/t/p/w500';
  
  return {
    id: raw.id,
    title: raw.title ?? 'Untitled',
    overview: raw.overview ?? '',
    posterUrl: raw.poster_path 
      ? `${imageBase}${raw.poster_path}` 
      : '/images/placeholder.png',
    releaseYear: raw.release_date 
      ? new Date(raw.release_date).getFullYear() 
      : null,
    rating: raw.vote_average ?? 0,
    genreIds: raw.genre_ids ?? [],
  };
}

/**
 * 转换整个电影列表响应包
 */
export function transformMovieListResponse(raw: TMDBMovieListRawResponse): MovieListResponse {
  return {
    results: Array.isArray(raw.results) ? raw.results.map(transformMovie) : [],
    totalPages: raw.total_pages ?? 0,
    totalResults: raw.total_results ?? 0,
    currentPage: raw.page ?? 1,
  };
}
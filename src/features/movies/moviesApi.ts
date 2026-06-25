import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MovieListResponse, TMDBMovieListRawResponse, Movie } from '@/types/movie.types';
import type { MovieFilters } from '@/types/filter.types';
import { transformMovieListResponse } from '@/services/dataTransformers';

/**
 * 将 Redux 中的筛选状态序列化为 TMDB API 兼容的 Query 参数
 */
function buildQueryParams(filters: MovieFilters): Record<string, string> {
  const params: Record<string, string> = {
    page: String(filters.page),
    sort_by: filters.sortBy,
  };

  if (filters.genreId !== null) {
    params.with_genres = String(filters.genreId);
  }
  if (filters.releaseYear !== null) {
    params.primary_release_year = String(filters.releaseYear);
  }
  if (filters.minRating > 0) {
    params['vote_average.gte'] = String(filters.minRating);
  }
  if (filters.searchQuery.trim() !== '') {
    params.query = filters.searchQuery;
  }

  return params;
}

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_TMDB_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_TMDB_API_READ_TOKEN}`);
      return headers;
    },
  }),
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    getMovies: builder.query<MovieListResponse, MovieFilters>({
      query: (filters) => ({
        url: filters.searchQuery.trim() !== '' ? '/search/movie' : '/discover/movie',
        params: buildQueryParams(filters),
      }),
      transformResponse: (rawResponse: TMDBMovieListRawResponse): MovieListResponse => {
        return transformMovieListResponse(rawResponse);
      },
      providesTags: ['Movies'],
    }),
    getMovieById: builder.query<Movie, number>({
      query: (id) => `/movie/${id}`,
    }),
  }),
});

export const { useGetMoviesQuery, useGetMovieByIdQuery } = moviesApi;
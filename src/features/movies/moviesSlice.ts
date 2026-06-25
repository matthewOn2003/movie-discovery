import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MovieFilters } from '@/types/filter.types';
import type { SortOption } from '@/types/filter.types';

const initialState: MovieFilters = {
  genreId: null,
  releaseYear: null,
  minRating: 0,
  sortBy: 'popularity.desc',
  page: 1,
  searchQuery: '',
};

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setGenreFilter: (state, action: PayloadAction<number | null>) => {
      state.genreId = action.payload;
      state.page = 1; 
    },
    setReleaseYearFilter: (state, action: PayloadAction<number | null>) => {
      state.releaseYear = action.payload;
      state.page = 1;
    },
    setMinRatingFilter: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setGenreFilter,
  setReleaseYearFilter,
  setMinRatingFilter,
  setSortBy,
  setSearchQuery,
  setPage,
  resetFilters,
} = moviesSlice.actions;

export default moviesSlice.reducer;
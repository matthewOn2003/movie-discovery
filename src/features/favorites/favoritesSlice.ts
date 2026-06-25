import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from '@/types';

export interface FavoritesState {
  ids: number[];
  items: Record<number, Movie>;
}

// 封装持久化读取逻辑，严格进行环境检查以防御 SSR 阶段报错
const getInitialState = (): FavoritesState => {
  if (typeof window === 'undefined') {
    return { ids: [], items: {} };
  }
  try {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : { ids: [], items: {} };
  } catch {
    return { ids: [], items: {} };
  }
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: getInitialState(),
  reducers: {
    addFavorite: (state, action: PayloadAction<Movie>) => {
      if (!state.ids.includes(action.payload.id)) {
        state.ids.push(action.payload.id);
        state.items[action.payload.id] = action.payload;
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
      delete state.items[action.payload];
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
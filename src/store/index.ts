import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '@/features/movies/moviesSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';
import { moviesApi } from '@/features/movies/moviesApi';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    favorites: favoritesReducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(moviesApi.middleware),
});

// 订阅 Store 变更，手动同步收藏夹状态至本地客户端缓存
store.subscribe(() => {
  try {
    const { favorites } = store.getState();
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to write localStorage:', error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
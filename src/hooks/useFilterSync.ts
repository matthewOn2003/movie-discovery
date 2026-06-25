import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

/**
 * 筛选条件联动 Hook：监听 Redux 状态，实时同构映射至 URL 终端参数
 */
export function useFilterSync() {
  const navigate = useNavigate();
  const filters = useAppSelector((state) => state.movies);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchQuery.trim() !== '') {
      params.set('q', filters.searchQuery);
    }
    if (filters.genreId !== null) {
      params.set('genre', String(filters.genreId));
    }
    if (filters.releaseYear !== null) {
      params.set('year', String(filters.releaseYear));
    }
    if (filters.minRating > 0) {
      params.set('rating', String(filters.minRating));
    }
    if (filters.sortBy) {
      params.set('sort', filters.sortBy);
    }
    if (filters.page > 1) {
      params.set('page', String(filters.page));
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `?${queryString}` : '';

    navigate(targetUrl);
  }, [filters, navigate]);
}
/**
 * 排序选项字面量联合类型
 * 严格对应 TMDB API 支持的排序参数
 */
export type SortOption =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'release_date.desc'
  | 'release_date.asc';

/**
 * 电影多条件筛选系统的状态模型
 */
export interface MovieFilters {
  genreId: number | null;
  releaseYear: number | null;
  minRating: number;
  sortBy: SortOption;
  page: number;
  searchQuery: string;
}
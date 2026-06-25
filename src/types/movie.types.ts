/**
 * TMDB API 返回的原始电影数据结构
 * 根据真实 API 响应样本进行定义，确保字段类型精确性
 */
export interface TMDBMovieRaw {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    title: string;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    release_date: string; // 格式: YYYY-MM-DD
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
  
  /**
   * TMDB API 列表接口的原始响应结构
   */
  export interface TMDBMovieListRawResponse {
    page: number;
    results: TMDBMovieRaw[];
    total_pages: number;
    total_results: number;
  }
  
  /**
   * 系统内部消费的核心电影数据模型
   * 经由 dataTransformers 清洗转换后供 UI 组件使用
   */
  export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterUrl: string;
    releaseYear: number | null;
    rating: number;
    genreIds: number[];
  }
  
  /**
   * 转换后的标准化电影列表响应结构
   */
  export interface MovieListResponse {
    results: Movie[];
    totalPages: number;
    totalResults: number;
    currentPage: number;
  }
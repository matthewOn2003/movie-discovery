/**
 * 通用 API 异步请求状态管理接口
 * 显式规避 any 类型，支持泛型数据注入
 */
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { useAppSelector } from '@/store/hooks';
import { MediaCard } from '@/components/MediaCard';

export function MoviesList() {
  // 从 Redux 读取当前筛选条件
  const filters = useAppSelector((state) => state.movies);

  // 把筛选条件传给 RTK Query
  const { data, isLoading, isError } = useGetMoviesQuery(filters);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败，请重试</div>;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {data?.results.map((movie) => (
        <MediaCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
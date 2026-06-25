import React from 'react';
import { Film, Calendar, Star, RefreshCw, Layers } from 'lucide-react';
import { GENRES } from '@/data/genres';

// 1. Props 接口定义（紧贴组件，非独立文件）
interface FilterPanelProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  totalCount: number;
}

const YEARS = [
  { value: 'All', label: 'All Years (全部年份)' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: 'Older', label: 'Older than 2022' },
];

const SORTS = [
  { value: 'rating-desc', label: 'Top Rated (评分最高)' },
  { value: 'year-desc', label: 'Latest Release (最新上映)' },
  { value: 'year-asc', label: 'Oldest Release (最老上映)' },
  { value: 'title-asc', label: 'Title A-Z (标题字母)' },
];

// 2. 组件函数（具名函数，便于 DevTools 识别）
export function FilterPanel({
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  minRating,
  onRatingChange,
  sortBy,
  onSortChange,
  onReset,
  totalCount,
}: FilterPanelProps) {
  // 3. Hooks 声明区（不穿插 JSX）
  // No complex state needed here as we use controlled props. Let's add any helper hooks or calculations.

  // 4. 事件处理函数（handleXxx 命名）
  function handleGenreChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onGenreChange(e.target.value);
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onYearChange(e.target.value);
  }

  function handleRatingChange(e: React.ChangeEvent<HTMLInputElement>) {
    onRatingChange(parseFloat(e.target.value));
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onSortChange(e.target.value);
  }

  function handleResetClick() {
    onReset();
  }

  // 5. 渲染
  return (
    <div id="filter-panel-root" className="flex flex-col space-y-6">
      {/* Title & Stats */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Filters & Sorting
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalCount} movies matching your query
          </p>
        </div>
        <button
          id="btn-reset-filters"
          onClick={handleResetClick}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700 cursor-pointer"
        >
          <RefreshCw size={12} className="transition-transform duration-300 hover:rotate-180" />
          Reset
        </button>
      </div>

      {/* Genre Filter */}
      <div className="space-y-2">
        <label htmlFor="genre-select" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Film size={14} className="text-amber-500" />
          <span>Genre / 电影类型</span>
        </label>
        <div className="relative">
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={handleGenreChange}
            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {GENRES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Year Filter */}
      <div className="space-y-2">
        <label htmlFor="year-select" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Calendar size={14} className="text-amber-500" />
          <span>Release Year / 放映年份</span>
        </label>
        <div className="relative">
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {YEARS.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Rating Filter Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="rating-slider" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Star size={14} className="text-amber-500 fill-amber-500/10" />
            <span>Minimum Rating / 最低评分</span>
          </label>
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
            ★ {minRating.toFixed(1)}+
          </span>
        </div>
        <div className="space-y-1">
          <input
            id="rating-slider"
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={handleRatingChange}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-500 outline-none transition-all hover:bg-slate-750"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Any</span>
            <span>5.0</span>
            <span>7.5</span>
            <span>9.0</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Sort Filter */}
      <div className="space-y-2">
        <label htmlFor="sort-select" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Layers size={14} className="text-amber-500" />
          <span>Sort By / 排序规则</span>
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

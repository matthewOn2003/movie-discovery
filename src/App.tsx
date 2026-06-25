import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Heart, Film, SlidersHorizontal, Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GENRES } from '@/data/genres';
import { useGetMoviesQuery } from '@/features/movies/moviesApi';
import { MediaCard } from './components/MediaCard/MediaCard';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './components/ui/sheet';
import type { FilterState, Movie } from './types';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

export default function App() {

  // 1. Core Filter & Search States
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    genre: searchParams.get('genre') ?? 'All',
    year: searchParams.get('year') ?? 'All',
    minRating: Number(searchParams.get('rating') ?? 0),
    sortBy: searchParams.get('sort') ?? 'rating-desc',
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const stored = localStorage.getItem('favorites');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      const final = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
      return Array.isArray(final) ? final : [];
    } catch {
      return [];
    }
  });
  const [viewOnlyFavorites, setViewOnlyFavorites] = useState(false);

  // const { data, isLoading, isError } = useGetMoviesQuery({
  //   genreId: filters.genre === 'All' ? null : parseInt(filters.genre),
  //   releaseYear: filters.year === 'All' ? null : parseInt(filters.year),
  //   minRating: filters.minRating,
  //   sortBy: 'popularity.desc',
  //   page: 1,
  //   searchQuery,
  // });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.genre !== 'All') params.genre = filters.genre;
    if (filters.year !== 'All') params.year = filters.year;
    if (filters.minRating > 0) params.rating = String(filters.minRating);
    if (filters.sortBy !== 'rating-desc') params.sort = filters.sortBy;
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params, { replace: true });
  }, [filters, searchQuery]);
  
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);


  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  const { data, isLoading, isFetching } = useGetMoviesQuery({
    genreId: filters.genre === 'All' ? null : parseInt(filters.genre),
    releaseYear: filters.year === 'All' ? null : parseInt(filters.year),
    minRating: filters.minRating,
    sortBy: 'popularity.desc',
    page,
    searchQuery,
  });

  // 每次拿到新数据就累积进 allMovies
  useEffect(() => {
    if (data?.results) {
      setAllMovies((prev) =>
        page === 1 ? data.results : [...prev, ...data.results]
      );
    }
  }, [data]);

  // 筛选条件变化时重置
  useEffect(() => {
    setPage(1);
    setAllMovies([]);
  }, [filters, searchQuery]);

  const hasNextPage = page < (data?.totalPages ?? 1);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => setPage((prev) => prev + 1),
    hasNextPage,
    isLoading: isFetching,
  });
  

  // 2. Event Handlers (handleXxx naming)
  function handleGenreChange(genre: string) {
    setFilters((prev) => ({ ...prev, genre }));
  }

  function handleYearChange(year: string) {
    setFilters((prev) => ({ ...prev, year }));
  }

  function handleRatingChange(minRating: number) {
    setFilters((prev) => ({ ...prev, minRating }));
  }

  function handleSortChange(sortBy: string) {
    setFilters((prev) => ({ ...prev, sortBy }));
  }

  function handleResetFilters() {
    setFilters({
      genre: 'All',
      year: 'All',
      minRating: 0,
      sortBy: 'rating-desc',
    });
    setSearchQuery('');
    setViewOnlyFavorites(false);
  }

  function handleFavoriteToggle(movie: Movie) {
    setFavorites((prev) =>
      prev.some((f) => f.id === movie.id)
        ? prev.filter((f) => f.id !== movie.id)
        : [...prev, movie]
    );
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleToggleFavoritesView() {
    setViewOnlyFavorites((prev) => !prev);
  }

  // 3. Computed / Filtered Movie List
  const getGenreLabel = (value) => {
    const genre = GENRES.find((g) => {
      return g.value === value
    })
    return genre.label
  }
  // Is any filter active?
  const isFilteringActive = useMemo(() => {
    return (
      filters.genre !== 'All' ||
      filters.year !== 'All' ||
      filters.minRating > 0 ||
      searchQuery !== '' ||
      viewOnlyFavorites
    );
  }, [filters, searchQuery, viewOnlyFavorites]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20">
              <Film className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                CineScreen
              </h1>
              <p className="hidden text-[10px] text-slate-400 sm:block">
                Curated Cinematic Library
              </p>
            </div>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center gap-3">
            {/* Favorites Toggle Button */}
            <button
              id="btn-toggle-fav-view"
              onClick={handleToggleFavoritesView}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                viewOnlyFavorites
                  ? 'border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                  : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${viewOnlyFavorites ? 'fill-rose-500' : ''}`} />
              <span>Favorites ({favorites.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Page Layout Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 p-6 sm:p-8 border border-slate-900 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Explore the World of Film
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Browse through our highly curated list of premium releases. Use our advanced sidebar filters on desktop or the swipe-up drawer on mobile to discover ratings, release schedules, and your favorite cinematography.
          </p>
        </div>

        {/* Outer Layout: Sidebar (desktop) / Drawer Trigger (mobile) + List Container */}
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* A. DESKTOP FILTER SIDEBAR (hidden lg:block lg:w-64) */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="sticky top-24 rounded-xl border border-slate-900 bg-slate-900/20 p-5 backdrop-blur-xs">
              <FilterPanel
                selectedGenre={filters.genre}
                onGenreChange={handleGenreChange}
                selectedYear={filters.year}
                onYearChange={handleYearChange}
                minRating={filters.minRating}
                onRatingChange={handleRatingChange}
                sortBy={filters.sortBy}
                onSortChange={handleSortChange}
                onReset={handleResetFilters}
                totalCount={data?.results.length ?? 0}
              />
            </div>
          </aside>

          {/* B. RIGHT-HAND GRID & SEARCH CONTENT AREA */}
          <div className="flex-1 space-y-6">
            
            {/* Search, Mobile Drawer, Sorting Controls Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Search Bar with Sliders button for mobile */}
              <div className="relative flex-1">
                <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="movie-search-input"
                  type="text"
                  placeholder="Search movies, descriptions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-12 py-2.5 text-sm text-slate-300 placeholder-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                
                {/* Clear search icon inside bar */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Mobile Filter Trigger Sheet (using shadcn drawer side bottom) */}
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 lg:hidden cursor-pointer w-full">
                    <SlidersHorizontal size={15} className="text-amber-500" />
                    <span>Filter & Sort (筛选)</span>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Filter Cinematic Catalog</SheetTitle>
                      <SheetDescription>
                        Narrow down films by genre, year of release, audience rating, and sorting criteria.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 pb-6">
                      <FilterPanel
                        selectedGenre={filters.genre}
                        onGenreChange={handleGenreChange}
                        selectedYear={filters.year}
                        onYearChange={handleYearChange}
                        minRating={filters.minRating}
                        onRatingChange={handleRatingChange}
                        sortBy={filters.sortBy}
                        onSortChange={handleSortChange}
                        onReset={handleResetFilters}
                        totalCount={data?.results.length ?? 0}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters Badges Row */}
            {isFilteringActive && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-900/30 p-2.5 border border-slate-900 text-xs">
                <span className="text-slate-500 font-medium mr-1.5">Active filters:</span>
                
                {filters.genre !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-amber-400 font-medium">
                    {/* {GENRES.find(g => g.value == filters.genre)} */}
                    { getGenreLabel(filters.genre)}
                    {/* { filters.genre } */}
                    <button onClick={() => handleGenreChange('All')} className="hover:text-amber-200 ml-0.5 cursor-pointer">×</button>
                  </span>
                )}
                
                {filters.year !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-amber-400 font-medium">
                    {filters.year}
                    <button onClick={() => handleYearChange('All')} className="hover:text-amber-200 ml-0.5 cursor-pointer">×</button>
                  </span>
                )}
                
                {filters.minRating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-amber-400 font-medium">
                    ★ {filters.minRating}+
                    <button onClick={() => handleRatingChange(0)} className="hover:text-amber-200 ml-0.5 cursor-pointer">×</button>
                  </span>
                )}

                {searchQuery !== '' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-amber-400 font-medium max-w-xs truncate">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-amber-200 ml-0.5 cursor-pointer">×</button>
                  </span>
                )}

                {viewOnlyFavorites && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-rose-400 font-medium">
                    Favorites Only
                    <button onClick={() => setViewOnlyFavorites(false)} className="hover:text-rose-200 ml-0.5 cursor-pointer">×</button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-slate-400 hover:text-white underline ml-auto cursor-pointer pl-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* C. MEDIA CARD GRID LAYOUT */}
            <AnimatePresence mode="popLayout">
              {(viewOnlyFavorites ? favorites.length : (data?.results.length ?? 0)) > 0 ? (
                <motion.div
                  className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {(viewOnlyFavorites ? favorites : allMovies).map((movie) => (
                    <MediaCard
                      key={movie.id}
                      title={movie.title}
                      posterUrl={movie.posterUrl}
                      rating={movie.rating}
                      isFavorited={(favorites).some((f) => f.id === movie.id)}
                      onFavoriteToggle={() => handleFavoriteToggle(movie)}
                    />
                  ))}
                </motion.div>
              ) : (
                /* Empty Search Result State */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16 text-center bg-slate-900/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-500 mb-4">
                    <HelpCircle size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-300">No movies found</h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
                    Try adjusting your criteria, clearing some active filters, or typing a different keyword to see results.
                  </p>
                  <button
                    id="btn-empty-reset"
                    onClick={handleResetFilters}
                    className="mt-5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/15 cursor-pointer"
                  >
                    Reset all searches & filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {!viewOnlyFavorites && (
          <div ref={sentinelRef} className="h-10 w-full" />
        )}
        {isFetching && (
          <div className="py-6 text-center text-sm text-slate-500">Loading more...</div>
        )}
      </main>

      {/* 3. Global Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 CineScreen. Styled with modern Inter typography, Tailwind CSS & Motion.</p>
          <p className="mt-1 text-[11px] text-slate-600">Built for Cinephiles and collectors of fine filmography.</p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Image } from '../Image';

// 1. Props 接口定义（紧贴组件，非独立文件）
interface MediaCardProps {
  title: string;
  posterUrl: string;
  rating: number;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  key?: string | number;
}

// 2. 组件函数（具名函数，便于 DevTools 识别）
export function MediaCard({
  title,
  posterUrl,
  rating,
  isFavorited,
  onFavoriteToggle,
}: MediaCardProps) {
  // 3. Hooks 声明区（不穿插 JSX）
  const [isHovered, setIsHovered] = useState(false);

  // 4. 事件处理函数（handleXxx 命名）
  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle();
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  // 5. 渲染
  return (
    <motion.div
      id={`media-card-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="transform object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold backdrop-blur-xs">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span className="text-amber-400">{rating.toFixed(1)}</span>
        </div>

        {/* Favorite Button */}
        <button
          id={`fav-btn-${title.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-slate-300 backdrop-blur-xs transition-all duration-200 hover:scale-110 hover:bg-slate-800"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              isFavorited
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-300 group-hover/btn:text-rose-400'
            }`}
          />
        </button>

        {/* Hover Info Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-xs font-medium text-amber-400 uppercase tracking-widest mb-1">
            Now Playing
          </span>
          <h3 className="text-base font-bold text-white line-clamp-1">
            {title}
          </h3>
          <p className="mt-1.5 text-[11px] text-slate-300 line-clamp-2">
            Click card to view details, ratings, and save your favorites instantly.
          </p>
        </div>
      </div>

      {/* Static Info Footer (visible on non-hover to retain context) */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
            {title}
          </h4>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-500/20 text-amber-500" />
            <span className="font-medium text-slate-300">{rating.toFixed(1)}</span>
          </div>
          <span className="rounded-sm bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300">
            Cinema HD
          </span>
        </div>
      </div>
    </motion.div>
  );
}

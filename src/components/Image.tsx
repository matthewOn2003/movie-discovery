import type { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}

export function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  ...props
}: ImageProps) {
  // If fill is true, mimic Next.js fill behavior (absolute positioning covering the parent)
  const imageStyles = fill
    ? {
        position: 'absolute' as const,
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover' as const,
        objectPosition: 'center' as const,
      }
    : {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      };

  return (
    <img
      src={src}
      alt={alt}
      style={imageStyles}
      className={className}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
}

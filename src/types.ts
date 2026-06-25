export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  rating: number;
  genre: string;
  year: number;
  description: string;
}

export interface FilterState {
  genre: string;
  year: string;
  minRating: number;
  sortBy: string;
}

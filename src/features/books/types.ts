export type ReadingStatus = "want" | "reading" | "done";
export type CoverTone =
  "blue" | "ochre" | "green" | "plum" | "sand" | "charcoal";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  year: number;
  genre: string;
  pages: number;
  isbn: string;
  cover: CoverTone;
  coverLabel: string;
  catalogRating: number;
}

export interface LibraryEntry {
  id: string;
  bookId: string;
  status: ReadingStatus;
  rating: number | null;
  updatedAt: string;
}

export interface BookFilters {
  query: string;
  genre: string;
  yearFrom: string;
  yearTo: string;
  minRating: string;
  status: "all" | ReadingStatus;
  sort: "relevance" | "title" | "year-desc" | "rating-desc";
}

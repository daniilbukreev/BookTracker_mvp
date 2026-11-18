import type { Book, BookFilters, LibraryEntry } from "../features/books/types";

export function filterBooks(
  books: Book[],
  entries: LibraryEntry[],
  filters: BookFilters,
): Book[] {
  const query = filters.query.trim().toLocaleLowerCase("ru");
  const entryByBook = new Map(entries.map((entry) => [entry.bookId, entry]));
  const filtered = books.filter((book) => {
    const matchesQuery =
      !query ||
      `${book.title} ${book.author} ${book.isbn} ${book.genre} ${book.description}`
        .toLocaleLowerCase("ru")
        .includes(query);
    const matchesGenre =
      filters.genre === "all" || book.genre === filters.genre;
    const matchesYearFrom =
      !filters.yearFrom || book.year >= Number(filters.yearFrom);
    const matchesYearTo =
      !filters.yearTo || book.year <= Number(filters.yearTo);
    const matchesRating =
      !filters.minRating || book.catalogRating >= Number(filters.minRating);
    const entry = entryByBook.get(book.id);
    const matchesStatus =
      filters.status === "all" ? true : entry?.status === filters.status;
    return (
      matchesQuery &&
      matchesGenre &&
      matchesYearFrom &&
      matchesYearTo &&
      matchesRating &&
      matchesStatus
    );
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "title":
        return a.title.localeCompare(b.title, "ru");
      case "year-desc":
        return b.year - a.year;
      case "rating-desc":
        return b.catalogRating - a.catalogRating;
      default:
        return 0;
    }
  });
}

export function validateYearRange(
  yearFrom: string,
  yearTo: string,
): string | null {
  if (
    yearFrom &&
    (!Number.isInteger(Number(yearFrom)) ||
      Number(yearFrom) < 0 ||
      Number(yearFrom) > 2100)
  )
    return "Укажите корректный год начала.";
  if (
    yearTo &&
    (!Number.isInteger(Number(yearTo)) ||
      Number(yearTo) < 0 ||
      Number(yearTo) > 2100)
  )
    return "Укажите корректный год окончания.";
  if (yearFrom && yearTo && Number(yearFrom) > Number(yearTo))
    return "Год «от» не может быть больше года «до». ";
  return null;
}

export function validateRating(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 5)
    return "Оценка должна быть целым числом от 1 до 5.";
  return null;
}

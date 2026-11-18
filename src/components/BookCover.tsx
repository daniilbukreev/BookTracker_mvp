import type { Book } from "../features/books/types";
export function BookCover({
  book,
  compact = false,
}: {
  book: Pick<Book, "cover" | "coverLabel" | "title">;
  compact?: boolean;
}) {
  return (
    <div
      className={`book-cover cover-${book.cover}${compact ? " book-cover-compact" : ""}`}
      role="img"
      aria-label={`Обложка книги «${book.title}»`}
    >
      <span>{book.coverLabel}</span>
    </div>
  );
}

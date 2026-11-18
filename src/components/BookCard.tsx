import { Link } from "react-router-dom";
import type { Book, LibraryEntry } from "../features/books/types";
import { BookCover } from "./BookCover";
import { StatusBadge } from "./StatusBadge";

export function BookCard({
  book,
  entry,
}: {
  book: Book;
  entry?: LibraryEntry;
}) {
  return (
    <article className="book-card">
      <Link
        className="book-card-cover-link"
        to={`/books/${book.id}`}
        aria-label={`Открыть книгу «${book.title}»`}
      >
        <BookCover book={book} />
      </Link>
      <div className="book-card-body">
        <div className="book-card-meta">
          <span>{book.year}</span>
          <span>★ {book.catalogRating.toFixed(1)}</span>
        </div>
        <h3>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="book-author">{book.author}</p>
        <p className="book-genre">{book.genre}</p>
        <div className="book-card-bottom">
          {entry ? (
            <StatusBadge status={entry.status} />
          ) : (
            <span className="muted-note">В каталоге</span>
          )}
          <Link
            className="arrow-link"
            to={`/books/${book.id}`}
            aria-label={`Подробнее: ${book.title}`}
          >
            →
          </Link>
        </div>
      </div>
    </article>
  );
}

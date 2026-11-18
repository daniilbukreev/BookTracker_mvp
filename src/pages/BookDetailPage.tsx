import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BookCover } from "../components/BookCover";
import { StatusBadge } from "../components/StatusBadge";
import {
  addBookToLibrary,
  changeLibraryEntry,
  removeBookFromLibrary,
  clearLibraryError,
} from "../features/library/librarySlice";
import type { ReadingStatus } from "../features/books/types";
import { validateRating } from "../utils/bookFilters";

export function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch = useAppDispatch();

  const book = useAppSelector((state) =>
    state.books.items.find((item) => item.id === bookId),
  );
  const entry = useAppSelector((state) =>
    state.library.entries.find((item) => item.bookId === bookId),
  );
  const booksStatus = useAppSelector((state) => state.books.status);
  const libraryError = useAppSelector((state) => state.library.error);

  const [status, setStatus] = useState<ReadingStatus>(entry?.status ?? "want");
  const [rating, setRating] = useState(
    entry?.rating ? String(entry.rating) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setStatus(entry.status);
      setRating(entry.rating ? String(entry.rating) : "");
    }
  }, [entry]);

  if (!book && booksStatus === "loading") {
    return (
      <section className="container page-section">
        <div className="state-panel" role="status">
          Загружаем книгу…
        </div>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="container page-section">
        <div className="state-panel empty-panel">
          <h2>Книга не найдена</h2>
          <p>
            Возможно, ссылка устарела или книга отсутствует в демо-каталоге.
          </p>
          <Link className="button button-small" to="/">
            Вернуться к поиску
          </Link>
        </div>
      </section>
    );
  }

  const currentBookId = book.id;

  async function saveBook() {
    const parsedRating = rating === "" ? null : Number(rating);

    if (parsedRating !== null) {
      const validation = validateRating(parsedRating);

      if (validation) {
        setError(validation);
        setSuccess(null);
        return;
      }
    }

    setError(null);
    setSuccess(null);
    dispatch(clearLibraryError());

    if (entry) {
      const result = await dispatch(
        changeLibraryEntry({
          entryId: entry.id,
          status,
          rating: parsedRating,
        }),
      );

      if (changeLibraryEntry.fulfilled.match(result)) {
        setSuccess("Изменения сохранены.");
      }
      return;
    }

    const result = await dispatch(
      addBookToLibrary({
        bookId: currentBookId,
        status,
      }),
    );

    if (!addBookToLibrary.fulfilled.match(result)) return;

    if (parsedRating !== null) {
      const update = await dispatch(
        changeLibraryEntry({
          entryId: result.payload.id,
          rating: parsedRating,
        }),
      );

      if (!changeLibraryEntry.fulfilled.match(update)) return;
    }

    setSuccess("Книга добавлена в библиотеку.");
  }

  async function removeBook() {
    if (!entry) return;

    dispatch(clearLibraryError());
    setSuccess(null);

    const result = await dispatch(removeBookFromLibrary(entry.id));

    if (removeBookFromLibrary.fulfilled.match(result)) {
      setRating("");
      setStatus("want");
      setError(null);
      setSuccess("Книга убрана из библиотеки.");
    }
  }

  return (
    <section className="container page-section detail-section">
      <div className="breadcrumbs">
        <Link to="/">Поиск книг</Link>
        <span>/</span>
        <span>{book.title}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-cover-wrap">
          <BookCover book={book} />
          <div className="cover-caption">ОБЛОЖКА КНИГИ</div>
        </div>

        <div className="detail-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            {book.genre.toLocaleUpperCase("ru")}
          </div>

          <h1>{book.title}</h1>
          <p className="detail-author">{book.author}</p>

          <div className="detail-facts">
            <span>
              ★ {book.catalogRating.toFixed(1)} <small>рейтинг каталога</small>
            </span>
            <span>
              {book.year} <small>год издания</small>
            </span>
            <span>
              {book.pages} <small>страниц</small>
            </span>
          </div>

          <p className="detail-description">{book.description}</p>

          <div className="detail-meta">
            <div>
              <span>Жанр</span>
              <strong>{book.genre}</strong>
            </div>
            <div>
              <span>ISBN</span>
              <strong>{book.isbn}</strong>
            </div>
          </div>

          <div className="personal-panel">
            <div className="personal-panel-heading">
              <div>
                <span className="section-kicker">ВАША КОЛЛЕКЦИЯ</span>
                <h2>Моя запись</h2>
              </div>
              {entry && <StatusBadge status={entry.status} />}
            </div>

            <label className="field-label">
              Статус чтения
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ReadingStatus)
                }
              >
                <option value="want">Хочу прочитать</option>
                <option value="reading">Читаю</option>
                <option value="done">Прочитано</option>
              </select>
            </label>

            <label className="field-label">
              Ваша оценка
              <select
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              >
                <option value="">Пока без оценки</option>
                <option value="1">1 — не понравилась</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 — отлично</option>
              </select>
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            {libraryError && (
              <p className="form-error" role="alert">
                {libraryError}
              </p>
            )}

            {success && !error && !libraryError && (
              <p className="form-success" role="status">
                {success}
              </p>
            )}

            <div className="personal-actions">
              <button className="button" type="button" onClick={saveBook}>
                {entry ? "Сохранить изменения" : "Добавить в библиотеку"}
                <span aria-hidden="true">→</span>
              </button>

              {entry && (
                <button
                  className="text-button danger-button"
                  type="button"
                  onClick={removeBook}
                >
                  Убрать из библиотеки
                </button>
              )}
            </div>
          </div>

          <Link className="back-link" to="/">
            ← Вернуться к каталогу
          </Link>
        </div>
      </div>
    </section>
  );
}

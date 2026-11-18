import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { BookCover } from "../components/BookCover";
import { StatusBadge } from "../components/StatusBadge";
import type { Book, ReadingStatus } from "../features/books/types";
import {
  changeLibraryEntry,
  removeBookFromLibrary,
} from "../features/library/librarySlice";

export function LibraryPage() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const entries = useAppSelector((state) => state.library.entries);
  const libraryStatus = useAppSelector((state) => state.library.status);
  const libraryError = useAppSelector((state) => state.library.error);

  const [statusFilter, setStatusFilter] = useState<"all" | ReadingStatus>(
    "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"updated" | "title" | "rating">("updated");

  const rows = useMemo(() => {
    const withBooks: { entry: (typeof entries)[number]; book: Book }[] =
      entries.flatMap((entry) => {
        const book = books.find((candidate) => candidate.id === entry.bookId);
        return book ? [{ entry, book }] : [];
      });

    return withBooks
      .filter(
        ({ entry, book }) =>
          (statusFilter === "all" || entry.status === statusFilter) &&
          `${book.title} ${book.author}`
            .toLocaleLowerCase("ru")
            .includes(query.trim().toLocaleLowerCase("ru")),
      )
      .sort((a, b) =>
        sort === "title"
          ? a.book.title.localeCompare(b.book.title, "ru")
          : sort === "rating"
            ? (b.entry.rating ?? 0) - (a.entry.rating ?? 0)
            : b.entry.updatedAt.localeCompare(a.entry.updatedAt),
      );
  }, [entries, books, statusFilter, query, sort]);

  const counts = {
    all: entries.length,
    want: entries.filter((entry) => entry.status === "want").length,
    reading: entries.filter((entry) => entry.status === "reading").length,
    done: entries.filter((entry) => entry.status === "done").length,
  };

  const completedPercent = entries.length
    ? Math.round((counts.done / entries.length) * 100)
    : 0;

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading library-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> ВАШЕ ЛИЧНОЕ ПРОСТРАНСТВО
            </div>
            <h1>
              Мой книжный <em>мир.</em>
            </h1>
            <p className="page-lead">
              Все истории, которые вы уже прочитали, читаете сейчас или только
              собираетесь открыть.
            </p>
          </div>
          <div className="heading-aside">
            <span className="aside-number">02</span>
            <span>
              ЛИЧНАЯ
              <br />
              КОЛЛЕКЦИЯ
            </span>
          </div>
        </div>

        <div className="library-overview">
          <div className="overview-main">
            <span className="section-kicker">ВАША КОЛЛЕКЦИЯ</span>
            <div className="overview-number">
              {counts.all}
              <small> книг</small>
            </div>
            <p>Каждая прочитанная страница — часть вашей истории.</p>
          </div>

          <div className="overview-progress">
            <div
              className="progress-ring"
              style={{ "--progress": `${completedPercent}%` } as CSSProperties}
            >
              <span>
                {completedPercent}
                <small>%</small>
              </span>
            </div>
            <div>
              <strong>
                {counts.done} из {counts.all}
              </strong>
              <span>книг прочитано</span>
            </div>
          </div>

          <div className="overview-stats">
            <div>
              <span className="stat-dot dot-reading" />{" "}
              <strong>{counts.reading}</strong>
              <small>Читаю</small>
            </div>
            <div>
              <span className="stat-dot dot-want" />{" "}
              <strong>{counts.want}</strong>
              <small>В планах</small>
            </div>
            <div>
              <span className="stat-dot dot-done" />{" "}
              <strong>{counts.done}</strong>
              <small>Прочитано</small>
            </div>
          </div>
        </div>

        <div className="results-toolbar library-toolbar">
          <div>
            <span className="section-kicker">МОИ КНИГИ</span>
            <h2 className="section-title">
              Моя <em>полка</em>
            </h2>
          </div>
          <Link className="button button-small" to="/">
            Найти книгу <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="library-controls">
          <div
            className="status-tabs"
            role="group"
            aria-label="Фильтр по статусу"
          >
            <button
              className={statusFilter === "all" ? "active" : ""}
              onClick={() => setStatusFilter("all")}
              type="button"
            >
              Все <span>{counts.all}</span>
            </button>
            <button
              className={statusFilter === "reading" ? "active" : ""}
              onClick={() => setStatusFilter("reading")}
              type="button"
            >
              Читаю <span>{counts.reading}</span>
            </button>
            <button
              className={statusFilter === "want" ? "active" : ""}
              onClick={() => setStatusFilter("want")}
              type="button"
            >
              В планах <span>{counts.want}</span>
            </button>
            <button
              className={statusFilter === "done" ? "active" : ""}
              onClick={() => setStatusFilter("done")}
              type="button"
            >
              Прочитано <span>{counts.done}</span>
            </button>
          </div>

          <div className="library-search">
            <label>
              <span className="visually-hidden">Поиск в моей библиотеке</span>
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Найти в библиотеке"
              />
            </label>
            <select
              aria-label="Сортировка библиотеки"
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
            >
              <option value="updated">Недавно изменённые</option>
              <option value="title">По названию</option>
              <option value="rating">По оценке</option>
            </select>
          </div>
        </div>

        {/* Ошибка CRUD-операции: не скрываем список книг */}
        {libraryError && libraryStatus !== "failed" && (
          <div className="state-panel error-panel" role="alert">
            {libraryError}
          </div>
        )}

        {libraryStatus === "loading" ? (
          <div className="state-panel" role="status">
            Открываем вашу библиотеку…
          </div>
        ) : libraryStatus === "failed" ? (
          <div className="state-panel error-panel" role="alert">
            {libraryError}
          </div>
        ) : rows.length > 0 ? (
          <div className="library-list">
            {rows.map(({ entry, book }) => (
              <article className="library-row" key={entry.id}>
                <Link to={`/books/${book.id}`}>
                  <BookCover book={book} compact />
                </Link>

                <div className="library-book-info">
                  <span className="book-genre">
                    {book.genre} · {book.year}
                  </span>
                  <h3>
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </h3>
                  <p>{book.author}</p>
                </div>

                <div className="library-row-status">
                  <StatusBadge status={entry.status} />
                  <span className="personal-rating">
                    {entry.rating ? `★ ${entry.rating}.0` : "Без оценки"}
                  </span>
                </div>

                <div className="library-row-actions">
                  <label
                    className="visually-hidden"
                    htmlFor={`status-${entry.id}`}
                  >
                    Статус книги «{book.title}»
                  </label>
                  <select
                    id={`status-${entry.id}`}
                    value={entry.status}
                    onChange={(event) =>
                      dispatch(
                        changeLibraryEntry({
                          entryId: entry.id,
                          status: event.target.value as ReadingStatus,
                        }),
                      )
                    }
                  >
                    <option value="want">Хочу прочитать</option>
                    <option value="reading">Читаю</option>
                    <option value="done">Прочитано</option>
                  </select>

                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`Удалить «${book.title}» из библиотеки`}
                    onClick={() => dispatch(removeBookFromLibrary(entry.id))}
                  >
                    ×
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="state-panel empty-panel">
            <span className="empty-mark">✧</span>
            <h3>
              {entries.length === 0
                ? "Ваша полка пока пуста"
                : "По этому запросу книг нет"}
            </h3>
            <p>
              {entries.length === 0
                ? "Найдите первую книгу и добавьте её в свою библиотеку."
                : "Измените фильтр или поисковый запрос."}
            </p>
            <Link className="button button-small" to="/">
              Перейти к поиску
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

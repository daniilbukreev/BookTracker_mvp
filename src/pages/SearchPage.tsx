import { useMemo, useState, type FormEvent } from "react";
import { useAppSelector } from "../app/hooks";
import { BookCard } from "../components/BookCard";
import { filterBooks, validateYearRange } from "../utils/bookFilters";
import type { BookFilters } from "../features/books/types";

const BOOKS_PER_PAGE = 3;

const initialFilters: BookFilters = {
  query: "",
  genre: "all",
  yearFrom: "",
  yearTo: "",
  minRating: "",
  status: "all",
  sort: "relevance",
};

export function SearchPage() {
  const {
    items: books,
    status,
    error,
  } = useAppSelector((state) => state.books);
  const entries = useAppSelector((state) => state.library.entries);

  const [filters, setFilters] = useState<BookFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<BookFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const results = useMemo(
    () => filterBooks(books, entries, appliedFilters),
    [books, entries, appliedFilters],
  );

  const genres = useMemo(
    () =>
      [...new Set(books.map((book) => book.genre))].sort((a, b) =>
        a.localeCompare(b, "ru"),
      ),
    [books],
  );

  const totalPages = Math.ceil(results.length / BOOKS_PER_PAGE);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return results.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [results, currentPage]);

  const update = <K extends keyof BookFilters>(
    key: K,
    value: BookFilters[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setFormError(null);
    setCurrentPage(1);
  };

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateYearRange(filters.yearFrom, filters.yearTo);
    setFormError(validation);

    if (validation) return;

    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading search-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> ВАША БИБЛИОТЕКА НАЧИНАЕТСЯ ЗДЕСЬ
            </div>
            <h1>
              Найдите свою <em>следующую</em> книгу.
            </h1>
            <p className="page-lead">
              Ищите по названию, автору, ISBN и содержанию книги. Сохраняйте
              интересное и собирайте личную коллекцию.
            </p>
          </div>
          <div className="heading-aside">
            <span className="aside-number">01</span>
            <span>
              КАТАЛОГ
              <br />
              КНИГ
            </span>
          </div>
        </div>

        <form className="search-panel" onSubmit={submitFilters}>
          <label className="search-input-wrap">
            <span className="visually-hidden">
              Поиск по названию, автору или ISBN
            </span>
            <span className="search-symbol" aria-hidden="true">
              ⌕
            </span>
            <input
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
              placeholder="Название, автор или ISBN..."
            />
          </label>

          <button className="button" type="submit">
            Найти книги <span aria-hidden="true">→</span>
          </button>

          <button
            className="filter-toggle"
            type="button"
            aria-expanded={showAdvanced}
            onClick={() => setShowAdvanced((value) => !value)}
          >
            {showAdvanced ? "Скрыть фильтры" : "Фильтры"}
            <span aria-hidden="true">⌄</span>
          </button>

          {showAdvanced && (
            <div className="advanced-filters">
              <label>
                Жанр
                <select
                  value={filters.genre}
                  onChange={(event) => update("genre", event.target.value)}
                >
                  <option value="all">Все жанры</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Год от
                <input
                  inputMode="numeric"
                  type="number"
                  min="0"
                  max="2100"
                  value={filters.yearFrom}
                  onChange={(event) => update("yearFrom", event.target.value)}
                  placeholder="Например, 2018"
                />
              </label>

              <label>
                Год до
                <input
                  inputMode="numeric"
                  type="number"
                  min="0"
                  max="2100"
                  value={filters.yearTo}
                  onChange={(event) => update("yearTo", event.target.value)}
                  placeholder="Например, 2025"
                />
              </label>

              <label>
                Рейтинг от
                <select
                  value={filters.minRating}
                  onChange={(event) => update("minRating", event.target.value)}
                >
                  <option value="">Любой</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.8">4.8+</option>
                </select>
              </label>

              <label>
                Статус в библиотеке
                <select
                  value={filters.status}
                  onChange={(event) =>
                    update(
                      "status",
                      event.target.value as BookFilters["status"],
                    )
                  }
                >
                  <option value="all">Любой статус</option>
                  <option value="want">Хочу прочитать</option>
                  <option value="reading">Читаю</option>
                  <option value="done">Прочитано</option>
                </select>
              </label>

              <label>
                Сортировка
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    update("sort", event.target.value as BookFilters["sort"])
                  }
                >
                  <option value="relevance">По умолчанию</option>
                  <option value="title">По названию</option>
                  <option value="year-desc">Сначала новые</option>
                  <option value="rating-desc">По рейтингу</option>
                </select>
              </label>

              <div className="filter-actions">
                <button className="text-button" type="button" onClick={reset}>
                  Сбросить фильтры
                </button>
                <button className="button button-small" type="submit">
                  Применить
                </button>
              </div>
            </div>
          )}
        </form>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <div className="results-toolbar">
          <div>
            <span className="section-kicker">КАТАЛОГ</span>
            <h2 className="section-title">
              Книги для <em>вас</em>
            </h2>
          </div>
          <span className="results-count">
            {results.length} {pluralBooks(results.length)}
          </span>
        </div>

        {status === "loading" && (
          <div className="state-panel" role="status">
            Загружаем каталог…
          </div>
        )}

        {status === "failed" && (
          <div className="state-panel error-panel" role="alert">
            {error}
          </div>
        )}

        {status === "succeeded" && results.length > 0 && (
          <>
            <div className="book-grid">
              {paginatedResults.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  entry={entries.find((entry) => entry.bookId === book.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination" aria-label="Страницы каталога">
                <button
                  type="button"
                  className="button button-small"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Назад
                </button>

                <span>
                  Страница {currentPage} из {totalPages}
                </span>

                <button
                  type="button"
                  className="button button-small"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Далее
                </button>
              </div>
            )}
          </>
        )}

        {status === "succeeded" && results.length === 0 && (
          <div className="state-panel empty-panel">
            <span className="empty-mark">⌕</span>
            <h3>Ничего не нашлось</h3>
            <p>Попробуйте изменить запрос или ослабить фильтры.</p>
            <button
              className="button button-small"
              type="button"
              onClick={reset}
            >
              Сбросить поиск
            </button>
          </div>
        )}

        <div className="catalog-note">
          <span>✦</span>
          <p>
            Каталог — отправная точка. Ваша личная библиотека будет расти вместе
            с вами.
          </p>
        </div>
      </div>
    </section>
  );
}

function pluralBooks(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "книга";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "книги";

  return "книг";
}

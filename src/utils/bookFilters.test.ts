import { describe, expect, it } from "vitest";
import { mockBooks } from "../data/books";
import type { BookFilters, LibraryEntry } from "../features/books/types";
import { filterBooks, validateRating, validateYearRange } from "./bookFilters";

const emptyEntries: LibraryEntry[] = [];
const base: BookFilters = {
  query: "",
  genre: "all",
  yearFrom: "",
  yearTo: "",
  minRating: "",
  status: "all",
  sort: "relevance",
};

describe("filterBooks", () => {
  it("searches by title and author without case sensitivity", () => {
    expect(
      filterBooks(mockBooks, emptyEntries, { ...base, query: "ХАНТЕР" }).map(
        (book) => book.id,
      ),
    ).toEqual(["blue-hour"]);
  });
  it("combines genre, year and rating filters", () => {
    const result = filterBooks(mockBooks, emptyEntries, {
      ...base,
      genre: "Нон-фикшн",
      yearFrom: "2020",
      minRating: "4.4",
    });
    expect(result.map((book) => book.id)).toEqual([
      "map-stars",
      "small-habits",
    ]);
  });
  it("filters by a personal reading status", () => {
    const entries: LibraryEntry[] = [
      {
        id: "e1",
        bookId: "blue-hour",
        status: "reading",
        rating: null,
        updatedAt: "",
      },
    ];
    expect(
      filterBooks(mockBooks, entries, { ...base, status: "reading" }).map(
        (book) => book.id,
      ),
    ).toEqual(["blue-hour"]);
  });
  it("sorts by rating in descending order", () => {
    const result = filterBooks(mockBooks, emptyEntries, {
      ...base,
      sort: "rating-desc",
    });
    expect(result[0].catalogRating).toBe(4.9);
  });
});

describe("form validation", () => {
  it("rejects an inverted year range", () =>
    expect(validateYearRange("2024", "2019")).toMatch(/не может быть больше/));
  it("accepts a valid year range", () =>
    expect(validateYearRange("2018", "2024")).toBeNull());
  it("accepts only integer ratings from one to five", () => {
    expect(validateRating(5)).toBeNull();
    expect(validateRating(5.5)).not.toBeNull();
    expect(validateRating(0)).not.toBeNull();
  });
});

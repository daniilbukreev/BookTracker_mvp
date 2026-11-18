import { describe, expect, it } from "vitest";
import reducer, { fetchBooks } from "./booksSlice";
import { mockBooks } from "../../data/books";

describe("books async states", () => {
  it("starts idle with an empty catalog", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state).toEqual({ items: [], status: "idle", error: null });
  });

  it("sets loading while books are being fetched", () => {
    const state = reducer(undefined, { type: fetchBooks.pending.type });
    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
  });

  it("stores books when fetch succeeds", () => {
    const state = reducer(undefined, {
      type: fetchBooks.fulfilled.type,
      payload: mockBooks,
    });
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(mockBooks);
  });

  it("sets an error when fetch fails", () => {
    const state = reducer(undefined, { type: fetchBooks.rejected.type });
    expect(state.status).toBe("failed");
    expect(state.error).toMatch(/Не удалось загрузить каталог/);
  });
});

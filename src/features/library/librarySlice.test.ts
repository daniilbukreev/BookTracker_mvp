import { describe, expect, it } from "vitest";
import reducer, {
  addBookToLibrary,
  loadLibrary,
  removeBookFromLibrary,
  replaceLibrary,
} from "./librarySlice";
import type { LibraryEntry } from "../books/types";

const entry: LibraryEntry = {
  id: "entry-1",
  bookId: "blue-hour",
  status: "reading",
  rating: null,
  updatedAt: "2026-01-01",
};

describe("library reducer", () => {
  it("replaces library entries", () => {
    const state = reducer(undefined, replaceLibrary([entry]));
    expect(state.entries).toEqual([entry]);
  });

  it("starts with an empty, idle state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state.status).toBe("idle");
    expect(state.entries).toEqual([]);
  });
});

describe("library async states", () => {
  it("sets loading while the library is being loaded", () => {
    const state = reducer(undefined, { type: loadLibrary.pending.type });
    expect(state.status).toBe("loading");
  });

  it("stores entries when library load succeeds", () => {
    const state = reducer(undefined, {
      type: loadLibrary.fulfilled.type,
      payload: [entry],
    });
    expect(state.status).toBe("succeeded");
    expect(state.entries).toEqual([entry]);
  });

  it("sets an error when library load fails", () => {
    const state = reducer(undefined, { type: loadLibrary.rejected.type });
    expect(state.status).toBe("failed");
    expect(state.error).toMatch(/Не удалось открыть библиотеку/);
  });

  it("adds an entry when addBookToLibrary succeeds", () => {
    const started = reducer(undefined, replaceLibrary([]));
    const state = reducer(started, {
      type: addBookToLibrary.fulfilled.type,
      payload: entry,
    });
    expect(state.entries).toEqual([entry]);
    expect(state.error).toBeNull();
  });

  it("removes an entry when removeBookFromLibrary succeeds", () => {
    const started = reducer(undefined, replaceLibrary([entry]));
    const state = reducer(started, {
      type: removeBookFromLibrary.fulfilled.type,
      payload: entry.id,
    });
    expect(state.entries).toEqual([]);
    expect(state.error).toBeNull();
  });
});

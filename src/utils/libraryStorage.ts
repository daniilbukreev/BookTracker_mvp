import type { LibraryEntry } from "../features/books/types";

const STORAGE_KEY = "booktracker.library.v1";

export function readLibrary(): LibraryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialLibrary();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLibraryEntry);
  } catch {
    return [];
  }
}

export function writeLibrary(entries: LibraryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function isLibraryEntry(value: unknown): value is LibraryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.bookId === "string" &&
    (entry.status === "want" ||
      entry.status === "reading" ||
      entry.status === "done") &&
    (entry.rating === null ||
      (typeof entry.rating === "number" &&
        entry.rating >= 1 &&
        entry.rating <= 5)) &&
    typeof entry.updatedAt === "string"
  );
}

function createInitialLibrary(): LibraryEntry[] {
  const now = new Date().toISOString();
  return [
    {
      id: "entry-1",
      bookId: "blue-hour",
      status: "reading",
      rating: null,
      updatedAt: now,
    },
    {
      id: "entry-2",
      bookId: "quiet-city",
      status: "want",
      rating: null,
      updatedAt: now,
    },
    {
      id: "entry-3",
      bookId: "garden-words",
      status: "done",
      rating: 5,
      updatedAt: now,
    },
    {
      id: "entry-4",
      bookId: "distant-shore",
      status: "reading",
      rating: 4,
      updatedAt: now,
    },
    {
      id: "entry-5",
      bookId: "letters-self",
      status: "done",
      rating: 5,
      updatedAt: now,
    },
    {
      id: "entry-6",
      bookId: "night-train",
      status: "want",
      rating: null,
      updatedAt: now,
    },
  ];
}

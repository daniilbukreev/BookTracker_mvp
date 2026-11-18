import {
  createAsyncThunk,
  createSlice,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { LibraryEntry, ReadingStatus } from "../books/types";
import { readLibrary, writeLibrary } from "../../utils/libraryStorage";

interface LibraryState {
  entries: LibraryEntry[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: LibraryState = { entries: [], status: "idle", error: null };

export const loadLibrary = createAsyncThunk<LibraryEntry[]>(
  "library/load",
  async () => readLibrary(),
);
export const addBookToLibrary = createAsyncThunk<
  LibraryEntry,
  { bookId: string; status: ReadingStatus }
>("library/add", async ({ bookId, status }, { getState }) => {
  const state = getState() as { library: LibraryState };
  const entry: LibraryEntry = {
    id: nanoid(),
    bookId,
    status,
    rating: null,
    updatedAt: new Date().toISOString(),
  };
  writeLibrary([...state.library.entries, entry]);
  return entry;
});
export const changeLibraryEntry = createAsyncThunk<
  LibraryEntry,
  { entryId: string; status?: ReadingStatus; rating?: number | null }
>("library/update", async ({ entryId, ...changes }, { getState }) => {
  const state = getState() as { library: LibraryState };
  const current = state.library.entries.find((entry) => entry.id === entryId);
  if (!current) throw new Error("Запись не найдена.");
  const updated = {
    ...current,
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  writeLibrary(
    state.library.entries.map((entry) =>
      entry.id === entryId ? updated : entry,
    ),
  );
  return updated;
});
export const removeBookFromLibrary = createAsyncThunk<string, string>(
  "library/remove",
  async (entryId, { getState }) => {
    const state = getState() as { library: LibraryState };
    writeLibrary(state.library.entries.filter((entry) => entry.id !== entryId));
    return entryId;
  },
);

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    clearLibraryError(state) {
      state.error = null;
    },
    replaceLibrary(state, action: PayloadAction<LibraryEntry[]>) {
      state.entries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLibrary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = action.payload;
      })
      .addCase(loadLibrary.rejected, (state) => {
        state.status = "failed";
        state.error = "Не удалось открыть библиотеку.";
      })
      .addCase(addBookToLibrary.fulfilled, (state, action) => {
        state.entries.push(action.payload);
        state.error = null;
      })
      .addCase(addBookToLibrary.rejected, (state) => {
        state.error =
          "Не удалось добавить книгу. Проверьте хранилище браузера.";
      })
      .addCase(changeLibraryEntry.fulfilled, (state, action) => {
        state.entries = state.entries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry,
        );
        state.error = null;
      })
      .addCase(changeLibraryEntry.rejected, (state) => {
        state.error = "Не удалось сохранить изменения.";
      })
      .addCase(removeBookFromLibrary.fulfilled, (state, action) => {
        state.entries = state.entries.filter(
          (entry) => entry.id !== action.payload,
        );
        state.error = null;
      })
      .addCase(removeBookFromLibrary.rejected, (state) => {
        state.error = "Не удалось удалить книгу.";
      });
  },
});

export const { clearLibraryError, replaceLibrary } = librarySlice.actions;
export default librarySlice.reducer;

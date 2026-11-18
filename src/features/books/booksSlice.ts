import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mockBooks } from "../../data/books";
import type { Book } from "./types";

interface BooksState {
  items: Book[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: BooksState = { items: [], status: "idle", error: null };

export const fetchBooks = createAsyncThunk<Book[]>(
  "books/fetchBooks",
  async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    return mockBooks;
  },
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state) => {
        state.status = "failed";
        state.error = "Не удалось загрузить каталог. Попробуйте ещё раз.";
      });
  },
});

export default booksSlice.reducer;

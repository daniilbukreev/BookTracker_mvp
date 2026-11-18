import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/books/booksSlice";
import libraryReducer from "../features/library/librarySlice";

export const store = configureStore({
  reducer: { books: booksReducer, library: libraryReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

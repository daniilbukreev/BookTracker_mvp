import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { useAppDispatch } from "./app/hooks";
import { fetchBooks } from "./features/books/booksSlice";
import { loadLibrary } from "./features/library/librarySlice";
import { AppLayout } from "./components/AppLayout";
import { SearchPage } from "./pages/SearchPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { LibraryPage } from "./pages/LibraryPage";
import "./styles.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <SearchPage /> },
        { path: "books/:bookId", element: <BookDetailPage /> },
        { path: "library", element: <LibraryPage /> },
      ],
    },
  ],
  { basename },
);

function Bootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(fetchBooks());
    void dispatch(loadLibrary());
  }, [dispatch]);
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Bootstrap />
    </Provider>
  );
}

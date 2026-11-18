import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookCover } from "./BookCover";

describe("BookCover", () => {
  it("exposes a meaningful accessible name", () => {
    render(
      <BookCover
        book={{
          title: "Синяя пора",
          cover: "blue",
          coverLabel: "THE BLUE HOUR",
        }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Обложка книги «Синяя пора»" }),
    ).toBeInTheDocument();
  });
});

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Имя репозитория: сайт будет на https://daniilbukreev.github.io/BookTracker_mvp/
  base: "/BookTracker_mvp/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: { reporter: ["text", "html"] },
  },
});

import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/pages/deeds": path.resolve(__dirname, "./src/views/deeds/entry.ts"),
      "@/pages/friends": path.resolve(__dirname, "./src/views/friends/entry.ts"),
      "@/pages/friend-deeds": path.resolve(__dirname, "./src/views/friend-deeds/entry.ts"),
      "@/pages/login": path.resolve(__dirname, "./src/views/login/entry.ts"),
      "@/pages/register": path.resolve(__dirname, "./src/views/register/entry.ts"),
      "@/pages/settings": path.resolve(__dirname, "./src/views/settings/entry.ts"),
      "@/pages/home": path.resolve(__dirname, "./src/views/home/entry.ts"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});

import { defineConfig } from "vite";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
  server: {
    port: 5173
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss({ optimize: { minify: true } })],
  preview: {
    allowedHosts: ["pixis.up.railway.app"], //no dupes
  },
  optimizeDeps: {
    include: ['@pixis/constants', '@pixis/schemas'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {

      "@": path.resolve(__dirname, "./src"),
    },
  },
});

import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "zinc-925": "#0b0b10",
      },
    },
  },
  plugins: [],
} satisfies Config;
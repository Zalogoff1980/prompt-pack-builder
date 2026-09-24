import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0a0a0c",
          900: "#111114",
          850: "#16161a",
          800: "#1c1c21",
          700: "#26262c",
          600: "#38383f",
          500: "#5a5a63",
          400: "#84848d",
          300: "#a9a9b2",
          200: "#cfcfd6",
          100: "#f2f2f4",
        },
        cyan: {
          accent: "#4fd8e0",
        },
        violet: {
          accent: "#9b87f5",
        },
        gold: {
          DEFAULT: "#c9a24b",
          light: "#f5da8a",
          dark: "#8a6a1f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(79,216,224,0.15), 0 8px 30px -10px rgba(79,216,224,0.25)",
        gold: "0 0 0 1px rgba(201,162,75,0.25), 0 8px 30px -10px rgba(201,162,75,0.35)",
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(135deg, rgba(79,216,224,0.16), rgba(155,135,245,0.16))",
        "grad-gold": "linear-gradient(135deg, #f5da8a, #c9a24b 55%, #8a6a1f)",
      },
    },
  },
  plugins: [],
};

export default config;

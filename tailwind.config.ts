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
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(79,216,224,0.15), 0 8px 30px -10px rgba(79,216,224,0.25)",
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(135deg, rgba(79,216,224,0.16), rgba(155,135,245,0.16))",
      },
    },
  },
  plugins: [],
};

export default config;

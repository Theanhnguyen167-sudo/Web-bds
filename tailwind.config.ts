import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a2744", // deep navy
          hover: "#141e34",
          light: "#24365d",
          foreground: "#ffffff",
        },
        navy: "#1a2744",
        accent: {
          DEFAULT: "#f97316", // vibrant orange
          hover: "#ea6c0a",
          light: "#ffedd5",
          foreground: "#ffffff",
        },
        page: {
          bg: "#f8fafc",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1e293b",
        },
        text: {
          primary: "#1e293b",
          secondary: "#64748b",
          muted: "#94a3b8",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        glow: "0 0 20px -3px rgba(249, 115, 22, 0.4)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

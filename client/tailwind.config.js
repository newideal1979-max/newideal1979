/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#080B14", // deepest background
          900: "#0B0F1C", // primary background
          800: "#121729", // surface
          700: "#1A2038", // surface-alt / raised cards
          600: "#242C48", // borders on dark
        },
        thread: {
          gold: "#C89B3C",
          "gold-bright": "#E3B856",
          blue: "#4A6CF7",
          "blue-deep": "#2F4BC4",
          plum: "#9563E0",
          "plum-deep": "#6E3FC0",
        },
        fabric: {
          100: "#F5F2E9", // warm off-white body text
          300: "#C9CBDA",
          500: "#8A90AC", // muted text
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(200,155,60,0.35), 0 8px 30px -8px rgba(200,155,60,0.35)",
      },
      backgroundImage: {
        stitch: "repeating-linear-gradient(90deg, rgba(200,155,60,0.5) 0 6px, transparent 6px 14px)",
      },
    },
  },
  plugins: [],
};

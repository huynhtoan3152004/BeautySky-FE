/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6BBCFE",
        secondary: "#248ce0",
      },
      fontFamily: {
        sans: ["Playwrite AU NSW", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "4rem",
        },
      },
    },
  },
  plugins: [],
};

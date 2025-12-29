/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: "#800020",
      },
      fontFamily: {
        elegant: ["Georgia", "serif"],
      },
      fontSize: {
        logo: ["3rem", { lineHeight: "1" }],
      },
    },
  },
  plugins: [],
};

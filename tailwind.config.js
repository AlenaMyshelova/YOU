/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./App.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3897F0",
        secondary: "#262626",
        background: "#FAFAFA",
        surface: "#FFFFFF",
        error: "#ED4956",
        success: "#78C257",
        muted: "#8E8E8E",
        border: "#DBDBDB",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};

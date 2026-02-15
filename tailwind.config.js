/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./App.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ─── Natural / Organic Palette ───────────────────
        primary: "#4A6741", // Forest green — leaf, growth
        "primary-light": "#6B8C5E", // Lighter sage
        secondary: "#3B3226", // Dark wood / bark
        background: "#ffffff", // Warm parchment / sand
        surface: "#FDFBF7", // Warm white / natural paper
        accent: "#D4A853", // Golden honey / sun
        earth: "#8B7355", // Warm brown / soil
        stone: "#9B958D", // Pebble grey
        water: "#5B8FA8", // Calm lake blue
        air: "#9BAFAD", // Misty sage
        fire: "#C67A3C", // Warm amber / candle
        error: "#B85450", // Muted terracotta red
        success: "#5E8B4A", // Moss green
        muted: "#8A8279", // Warm grey / driftwood
        border: "#D9D0C4", // Sandy border
        "border-light": "#E8E1D6", // Lighter sand border
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};

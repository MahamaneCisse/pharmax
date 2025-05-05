/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik-regular", "sans-serif"],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
        "copperplate-bold": ["Copperplate-Gothic-Std-33-BC", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#16db65",
          200: "#058C42",
          300: "#04471C",
        },
        accent: {
          100: "#fbfbfd",
        },
        black: {
          DEFAULT: "#000000",
          100: "#8c8e98",
          200: "#666876",
          300: "#191D31",
        },
        danger: "#f75555",
      },
    },
  },
  plugins: [],
};

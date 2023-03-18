/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-off-white": "#efefef",
        "rose-red": "#db2b39",
        "navy-blue": "#29335c",
        "primary": "#ffa01c",
        "primary-light": "#fcc88d",
        "neutral-off-black": "#1C211E",
      },
    },
  },
  plugins: [],
};

module.exports = config;

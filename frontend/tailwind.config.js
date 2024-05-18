/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        lightgrey: "#8E8E8E",
      },
      backgroundImage: {
        "my-image": "url(/public/green-background.avif)",
      },
    },
  },
  plugins: [],
};

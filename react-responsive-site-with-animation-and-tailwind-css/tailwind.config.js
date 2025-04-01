/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#010871",
        "secondary": "#9A7AF2",
        "tartiary": "#C0C0C0",
        "pink": "#EE9AE5"
      }
    },
  },
  plugins: [],
}


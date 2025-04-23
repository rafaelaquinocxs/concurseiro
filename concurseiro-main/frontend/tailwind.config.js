/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2E7D32',
        'primary-light': '#4CAF50',
        'primary-dark': '#1B5E20',
        'secondary': '#E8F5E9',
      },
    },
  },
  plugins: [],
}

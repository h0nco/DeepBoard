/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#f0f2f5',
          dark: '#1e1e1e',
        },
        node: {
          light: '#ffffff',
          dark: '#2d2d2d',
        },
        border: {
          light: '#d1d5db',
          dark: '#4b5563',
        }
      }
    },
  },
  plugins: [],
}
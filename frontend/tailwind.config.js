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
          light: '#f9fafb',   // единый светлый фон (как у панели)
          dark: '#111827',     // темный фон (gray-900)
        },
        node: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        border: {
          light: '#e5e7eb',
          dark: '#374151',
        }
      }
    },
  },
  plugins: [],
}
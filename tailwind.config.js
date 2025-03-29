/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Quét các file chứa class Tailwind
  ],
  theme: {
    extend: {}, // Tuỳ chỉnh theme
  },
  plugins: [],
};

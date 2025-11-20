/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Sangat penting agar Tailwind memindai semua file komponen Anda
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

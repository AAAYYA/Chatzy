/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#4F46E5",
        bg: "#F9FAFB",
        text: "#111827",
        accent: "#E0E7FF",
      },
    },
  },
  plugins: [],
};

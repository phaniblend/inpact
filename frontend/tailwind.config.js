/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // INPACT Brand Colors (from ContributEd design)
        'inpact-green': '#9bf945',
        'inpact-dark': '#0f172a',
        'inpact-bg': '#f5f7fa',
        'inpact-text': '#1f2933',
        'inpact-gray': '#6b7280',
        'inpact-card': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 10px 30px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 15px 40px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
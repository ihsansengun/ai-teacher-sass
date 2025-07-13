/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#A7C8DA',
          DEFAULT: '#6C93A6',
          dark: '#527788'
        },
        accent: '#4FC3F7',
        surface: '#F8FAFC',
        divider: '#E2E8F0',
        text: {
          primary: '#1F1F1F',
          muted: '#5A5A5A'
        },
        success: '#3CC87B'
      }
    }
  },
  plugins: [],
}
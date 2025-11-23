/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007bff',
          hover: '#0056b3',
          active: '#004085',
        },
        secondary: {
          DEFAULT: '#6c757d',
          hover: '#545b62',
          active: '#3e444a',
        },
        success: {
          DEFAULT: '#28a745',
          hover: '#218838',
          active: '#1e7e34',
        },
        danger: {
          DEFAULT: '#dc3545',
          hover: '#c82333',
          active: '#bd2130',
        },
        warning: {
          DEFAULT: '#ffc107',
          hover: '#e0a800',
          active: '#d39e00',
        },
        info: {
          DEFAULT: '#17a2b8',
          hover: '#138496',
          active: '#117a8b',
        },
      },
      animation: {
        spin: 'spin 0.6s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}


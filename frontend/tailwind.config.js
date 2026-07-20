/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fef6f5',
          100: '#fbe8e4',
          500: '#d97757',
          600: '#c55f40',
          700: '#a3482d',
          900: '#5e2615',
        },
        surface: {
          50: '#faf8f5', // Creamy background
          100: '#f5f2eb', // Cards
          200: '#e6e2d8', // Borders/Dividers
          300: '#d4cebe',
          400: '#a39c89', // Muted text
          500: '#757062',
          600: '#575246', // Secondary text
          700: '#3d3931', // Primary text
          800: '#2b2823',
          900: '#1a1815',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#fce4ec',
          100: '#f8bbd0',
          200: '#f48fb1',
          300: '#f06292',
          400: '#ec407a',
          500: '#c2185b',
          600: '#ad1457',
          700: '#880e4f',
          DEFAULT: '#c2185b',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#1a1a1a',
        },
        canvas: {
          DEFAULT: '#ffffff',
          muted: '#f6f6f7',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.08)',
        lift: '0 10px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
};

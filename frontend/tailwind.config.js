import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zinc: {
          50: '#fafafa',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#3a3a3c',
          800: '#343436',
          900: '#2c2c2e',
          950: '#242426'
        },
        slate: {
          50: '#f5f5f7',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#3a3a3c',
          800: '#343436',
          900: '#2c2c2e',
          950: '#242426'
        }
      }
    }
  },
  plugins: [
    typography,
  ],
}
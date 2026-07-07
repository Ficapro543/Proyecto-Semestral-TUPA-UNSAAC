/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002045',
          50: '#e6eaf0',
          100: '#c0c9d9',
          200: '#97a5be',
          300: '#6d80a3',
          400: '#4d6490',
          500: '#2d487d',
          600: '#274175',
          700: '#1f386b',
          800: '#182f61',
          900: '#0b1f4f',
        },
        tertiary: {
          DEFAULT: '#89f5e7',
          50: '#e0fcf9',
          100: '#b3f7ef',
          200: '#89f5e7',
          300: '#5cf1dc',
          400: '#3ceed4',
          500: '#20eacc',
          600: '#1dd1b8',
          700: '#18b59e',
          800: '#149a85',
          900: '#0b6c5c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Hanken Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

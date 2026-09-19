/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          bg: '#071626',
          deep: '#0B1F33',
          surface: '#102A43',
          elevated: '#163B5C',
          border: '#244B6A',
          teal: '#20C6B7',
          cyan: '#38BDF8',
          amber: '#F4B942',
          orange: '#F97316',
          coral: '#F05252',
          emerald: '#34D399',
          text: '#E6F4F1',
          secondary: '#A7C1D4',
          muted: '#6E8AA3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

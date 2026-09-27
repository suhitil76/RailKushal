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
          bg: '#F8FAFC',
          deep: '#F1F5F9',
          surface: '#FFFFFF',
          elevated: '#FFFFFF',
          border: '#E2E8F0',
          teal: '#0F766E',
          cyan: '#0369A1',
          amber: '#D97706',
          orange: '#C2410C',
          coral: '#B91C1C',
          emerald: '#059669',
          text: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
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

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--color-brand-50-rgb, 240 249 255) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100-rgb, 224 242 254) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200-rgb, 186 230 253) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300-rgb, 125 211 252) / <alpha-value>)',
          400: 'rgb(var(--color-brand-400-rgb, 56 189 248) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500-rgb, 2 132 199) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600-rgb, 3 105 161) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700-rgb, 7 89 133) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800-rgb, 12 74 110) / <alpha-value>)',
          900: 'rgb(var(--color-brand-900-rgb, 8 47 73) / <alpha-value>)',
          950: 'rgb(var(--color-brand-950-rgb, 4 29 45) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-brand-600-rgb, 3 105 161) / <alpha-value>)',
        },
        retail: {
          green: '#10b981',
          emerald: '#059669',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1'
        }
      },
      boxShadow: {
        'brand-glow': '0 0 25px -4px var(--brand-glow, rgba(2, 132, 199, 0.25))',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      }
    },
  },
  plugins: [],
}

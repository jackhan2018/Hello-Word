import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f0e8',
          100: '#e8e1d4',
          200: '#d1c3a9',
          300: '#b9a57d',
          400: '#a18752',
          500: '#896929',
          600: '#6b531f',
          700: '#4d3e16',
          800: '#2e290d',
          900: '#1a1a2e',
        },
        vermillion: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fdcaca',
          300: '#fba5a5',
          400: '#f87272',
          500: '#c73e3a',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        indigo: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#2d4a6f',
          800: '#243b53',
          900: '#102a43',
        },
        jade: {
          50: '#f3faf7',
          100: '#e3f5ec',
          200: '#c9ebd9',
          300: '#9ddbb9',
          400: '#6b8e7d',
          500: '#4d7a60',
          600: '#3d6250',
          700: '#2e4a3d',
          800: '#1f332a',
          900: '#0f1c17',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#d4a574',
          500: '#b45309',
          600: '#92400e',
          700: '#78350f',
          800: '#451a03',
          900: '#27120b',
        },
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['HarmonyOS Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'ink-spread': 'inkSpread 0.6s ease-out forwards',
        'typewriter': 'typewriter 2s steps(40) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        inkSpread: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

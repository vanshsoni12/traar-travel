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
          dark: '#0F766E',     // vibrant fresh teal
          darker: '#115E59',
          surface: '#14B8A6',
          primary: '#0D9488',
          primaryHover: '#0F766E',
          light: '#F0FDFA',
          teal: '#0D9488',
          tealDark: '#0F766E',
          canvas: '#F8FAFC',
        },
        pastel: {
          blue: '#E8F5FB',
          blueBorder: '#BAE0F2',
          yellow: '#FEF8D6',
          yellowBorder: '#F9EBA3',
          peach: '#FEEADA',
          peachBorder: '#FCD1B4',
          pink: '#FEE3E7',
          pinkBorder: '#FBBEC8',
          purple: '#EDDBFD',
          purpleBorder: '#D8B4FE',
          teal: '#2F8E84',
        },
        lavender: {
          50: '#FAF8FF',
          100: '#F3EFFF',
          200: '#E9E2FE',
          300: '#D8CCFE',
          400: '#B8A1FB',
          500: '#9A77F5',
          600: '#8050EA',
          700: '#6836D1',
          800: '#5328A8',
          900: '#432185',
        },
        stay: {
          DEFAULT: '#D97706',  // amber
          light: '#FEF3C7',
          border: '#FDE68A',
          dark: '#B45309',
        },
        food: {
          DEFAULT: '#EA580C',  // orange
          light: '#FFEDD5',
          border: '#FED7AA',
          dark: '#C2410C',
        },
        place: {
          DEFAULT: '#0284C7',  // blue
          light: '#E0F2FE',
          border: '#BAE6FD',
          dark: '#0369A1',
        },
        trip: {
          DEFAULT: '#9A77F5',  // lavender
          light: '#F3EFFF',
          border: '#E9E2FE',
          dark: '#6836D1',
        },
        alert: {
          DEFAULT: '#DC2626',  // red
          light: '#FEE2E2',
          border: '#FECACA',
          dark: '#B91C1C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FAF6F0',
          200: '#F5EFE6',
          300: '#EFE6D5',
          400: '#E4D5BC',
        },
        warmDark: {
          50: '#F4F0EC',
          100: '#E4D9CE',
          500: '#5C493B',
          700: '#3D2E24',
          800: '#2A1E17',
          900: '#1F140E',
        },
        terracotta: {
          50: '#FDF7F3',
          100: '#F7C8A4',
          500: '#B86D43',
          600: '#96532B',
          700: '#7A3F1F',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#D97706',
          600: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(42, 30, 23, 0.06), 0 1px 4px -1px rgba(42, 30, 23, 0.04)',
        'warm-md': '0 6px 16px -4px rgba(42, 30, 23, 0.08), 0 2px 6px -2px rgba(42, 30, 23, 0.04)',
        'warm-lg': '0 12px 28px -6px rgba(42, 30, 23, 0.12), 0 4px 12px -2px rgba(42, 30, 23, 0.06)',
      }
    },
  },
  plugins: [],
}


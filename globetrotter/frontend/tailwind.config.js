/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080B10',
          secondary: '#111720',
          card: '#151C26',
          hover: '#1B2432',
        },
        gold: {
          light: '#F3E4C8',
          DEFAULT: '#D6B477',
          dark: '#B08C4A',
          hover: '#E2C58E',
        },
        luxury: {
          text: '#F5F2EC',
          muted: '#A0A6AF',
          border: 'rgba(214, 180, 119, 0.18)',
          glow: 'rgba(214, 180, 119, 0.12)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E4C8 0%, #D6B477 50%, #B08C4A 100%)',
        'gold-metallic': 'linear-gradient(110deg, #D6B477 0%, #FFF3D6 25%, #D6B477 50%, #8A6E37 75%, #D6B477 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(8, 11, 16, 0.6) 0%, #080B10 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(214, 180, 119, 0.15)',
        'gold-md': '0 0 30px rgba(214, 180, 119, 0.22)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F2E8',
          light: '#FBF8F2',
          dark: '#EDE4D3',
        },
        burgundy: {
          DEFAULT: '#7B1E2B',
          deep: '#54131D',
          soft: '#F2E6E2',
        },
        error: {
          DEFAULT: '#B42318',
          soft: '#FDECEA',
          deep: '#7A1610',
        },
        ink: '#191919',
        muted: '#6B6560',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        label: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(25,25,25,0.05), 0 18px 40px -20px rgba(84,19,29,0.28)',
        panel: '0 24px 80px -24px rgba(25,25,25,0.45)',
      },
    },
  },
  plugins: [],
};

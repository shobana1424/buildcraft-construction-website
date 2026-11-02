/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#102B55', 800: '#0C2144', 700: '#16376B', 600: '#1E4585' },
        royal: { DEFAULT: '#1769E0', 600: '#1258BD', 50: '#EAF2FF' },
        ice: '#F2F6FF',
        gold: { DEFAULT: '#F5A623', 600: '#D98E0F', 50: '#FFF6E5' },
        success: '#16A34A',
        warning: '#F97316',
        danger: '#DC2626',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(16,43,85,0.18)',
        lift: '0 20px 45px -18px rgba(16,43,85,0.35)',
      },
    },
  },
  plugins: [],
};

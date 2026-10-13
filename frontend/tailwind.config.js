/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'crumple-toss': {
          '0%': { transform: 'scale(1) rotate(0deg)', borderRadius: '8px', opacity: '1' },
          '35%': { transform: 'scale(0.6) rotate(45deg) skew(15deg)', borderRadius: '40%', backgroundColor: '#d1d5db' },
          '70%': { transform: 'scale(0.25) rotate(220deg) translate(80px, 140px)', borderRadius: '50%', opacity: '0.8' },
          '100%': { transform: 'scale(0.05) rotate(360deg) translate(140px, 280px)', opacity: '0' }
        },
        'mascot-slide': {
          '0%': { transform: 'translateY(120%) scale(0.8)', opacity: '0' },
          '70%': { transform: 'translateY(-10px) scale(1.05)', opacity: '1' },
          '100%': { transform: 'translateY(0%) scale(1)', opacity: '1' }
        },
        'bin-shake': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.15) rotate(-12deg)' },
          '50%': { transform: 'scale(1.2) rotate(12deg)' },
          '75%': { transform: 'scale(1.15) rotate(-6deg)' }
        }
      },
      animation: {
        'crumple': 'crumple-toss 0.75s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards',
        'mascot': 'mascot-slide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'shake': 'bin-shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}

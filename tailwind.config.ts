import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          black: '#070709',
          surface: '#121218',
          'surface-light': '#1a1a22',
          white: '#f3f2ee',
          border: 'rgba(74, 98, 116, 0.25)',
        },
        brand: {
          ember: '#ff3b00',
          'ember-hover': '#e03400',
          'ember-glow': 'rgba(255, 59, 0, 0.25)',
        },
        quenched: {
          steel: '#4a6274',
          'steel-light': '#627d92',
          'steel-glow': 'rgba(74, 98, 116, 0.2)',
        },
        amber: {
          molten: '#ff9500',
        }
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'blueprint': '12px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'ember-glow': 'emberPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        emberPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 59, 0, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(255, 59, 0, 0.45)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;


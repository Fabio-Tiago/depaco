import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta DEPACO — baseada na logomarca
        cream: '#FDFBF7',          // fundo principal
        ink: '#1F1F1F',            // texto e outlines
        mustard: {
          DEFAULT: '#F4B936',      // amarelo mostarda (primária)
          50: '#FEF7E5',
          100: '#FDEFC8',
          200: '#FBE08C',
          300: '#F8CC58',
          400: '#F4B936',
          500: '#E09F1A',
          600: '#B47B12',
        },
        coral: {
          DEFAULT: '#F87956',      // laranja coral (secundária)
          50: '#FEEEE9',
          100: '#FCDCD2',
          200: '#FABCAB',
          300: '#F89B83',
          400: '#F87956',
          500: '#E55430',
          600: '#B83E21',
        },
        terracotta: {
          DEFAULT: '#E04E32',      // vermelho terracota (acento)
          50: '#FBE7E2',
          100: '#F7CFC4',
          200: '#EFA08B',
          300: '#E67460',
          400: '#E04E32',
          500: '#B83A22',
          600: '#8C2B19',
        },
        sky: {
          DEFAULT: '#7AC4D6',      // azul céu (acento secundário, do desenho do menino)
          100: '#E2F3F7',
        },
      },
      fontFamily: {
        // Fredoka pro display (já tinha no Lovable e combina com kids), Plus Jakarta Sans pro body
        display: ['var(--font-fredoka)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        chunky: '4px 4px 0 0 #1F1F1F',
        'chunky-sm': '2px 2px 0 0 #1F1F1F',
        'chunky-lg': '6px 6px 0 0 #1F1F1F',
        soft: '0 8px 24px -8px rgba(31, 31, 31, 0.15)',
      },
      animation: {
        'wiggle': 'wiggle 0.6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        mo: '100%',
        ta: '100%',
        pc: '1100px',
      },
    },
    extend: {
      colors: {
        background: 'var(--background)',
        white: 'var(--white)',
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
        },
        green: {
          100: 'var(--green-100)',
          200: 'var(--green-200)',
          300: 'var(--green-300)',
        },
        red: {
          50: 'var(--red-50)',
          100: 'var(--red-100)',
        },
        purple: {
          100: 'var(--purple-100)',
        },
        yellow: {
          100: 'var(--yellow-100)',
        },
        blue: {
          50: 'var(--blue-50)',
          100: 'var(--blue-100)',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        custom: '0px 4px 20px 0px rgba(0, 0, 0, 0.08)',
        'custom-dark': '0px 4px 20px 0px rgba(255, 255, 255, 0.08)',
      },
      fontSize: {
        // 12px
        '12': ['12px', { lineHeight: '18px', fontWeight: '400' }], // Regular
        '12md': ['12px', { lineHeight: '18px', fontWeight: '500' }], // Medium
        '12sb': ['12px', { lineHeight: '18px', fontWeight: '600' }], // Semibold

        // 12px
        '13md': ['13px', { lineHeight: '22px', fontWeight: '500' }], // Medium
        '13sb': ['13px', { lineHeight: '22px', fontWeight: '600' }], // Semibold

        // 14px
        '14': ['14px', { lineHeight: '24px', fontWeight: '400' }], // Regular
        '14md': ['14px', { lineHeight: '24px', fontWeight: '500' }], // Medium
        '14sb': ['14px', { lineHeight: '24px', fontWeight: '600' }], // Semibold
        '14b': ['14px', { lineHeight: '24px', fontWeight: '700' }], // Bold

        // 16px
        '16': ['16px', { lineHeight: '26px', fontWeight: '400' }], // Regular
        '16md': ['16px', { lineHeight: '26px', fontWeight: '500' }], // Medium
        '16sb': ['16px', { lineHeight: '26px', fontWeight: '600' }], // Semibold
        '16b': ['16px', { lineHeight: '26px', fontWeight: '700' }], // Bold

        // 18px
        '18': ['18px', { lineHeight: '26px', fontWeight: '400' }], // Regular
        '18md': ['18px', { lineHeight: '26px', fontWeight: '500' }], // Medium
        '18sb': ['18px', { lineHeight: '26px', fontWeight: '600' }], // Semibold
        '18b': ['18px', { lineHeight: '26px', fontWeight: '700' }], // Bold

        // 20px
        '20': ['20px', { lineHeight: '32px', fontWeight: '400' }], // Regular
        '20md': ['20px', { lineHeight: '32px', fontWeight: '500' }], // Medium
        '20sb': ['20px', { lineHeight: '32px', fontWeight: '600' }], // Semibold
        '20b': ['20px', { lineHeight: '32px', fontWeight: '700' }], // Bold

        // 24px
        '24': ['24px', { lineHeight: '32px', fontWeight: '400' }], // Regular
        '24md': ['24px', { lineHeight: '32px', fontWeight: '500' }], // Medium
        '24sb': ['24px', { lineHeight: '32px', fontWeight: '600' }], // Semibold
        '24b': ['24px', { lineHeight: '32px', fontWeight: '700' }], // Bold

        // 32px
        '32sb': ['32px', { lineHeight: '42px', fontWeight: '600' }], // Semibold
        '32b': ['32px', { lineHeight: '46px', fontWeight: '700' }], // Bold

        // 40px
        '40b': ['40px', { lineHeight: '42px', fontWeight: '700' }], // Bold

        // 48px
        '48sb': ['48px', { lineHeight: '46px', fontWeight: '600' }], // Semibold
      },
      borderRadius: {
        custom: '10px',
      },
    },
    screens: {
      mo: { max: '743px' },
      ta: { min: '744px', max: '1023px' },
      pc: { min: '1024px' },
      tamo: { max: '1024px' },
    },
  },
  plugins: [],
} satisfies Config;

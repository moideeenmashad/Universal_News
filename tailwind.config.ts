import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
        },
        light: '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-bricolage)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;


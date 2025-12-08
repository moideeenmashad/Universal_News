import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#202124',
        },
        light: '#ffffff',
      },
      fontFamily: {
        sans: ['BricolageGrotesque', 'sans-serif'],
        bricolage: ['BricolageGrotesque', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

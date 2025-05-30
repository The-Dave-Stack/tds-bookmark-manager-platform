/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#199A9A',
        secondary: '#1EDAB4',
        mainText: '#093142',
        invertedText: '#FFFFFF',
        darkText: '#F4F7F8',
        lightBg: '#F4F7F8',
        darkBg: '#091E42',
        altBg: '#093142',
        lightBorder: '#DCE3E5',
        darkBorder: '#1D2B38',
        link: '#199A9A',
        linkHover: '#1EDAB4',
        danger: '#C31717',
        success: '#1EDAB4'
      }
    },
  },
  plugins: [],
};
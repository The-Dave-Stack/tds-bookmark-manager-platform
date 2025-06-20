const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
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

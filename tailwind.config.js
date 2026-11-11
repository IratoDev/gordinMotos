import {palette} from './src/assets/theme/color'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        ...palette,
      },
    },
  },
  plugins: []
}


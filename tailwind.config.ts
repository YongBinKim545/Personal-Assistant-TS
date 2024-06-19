/** @type {import('tailwindcss').Config} */

// function getColorWithOpacity(rgb:string, opacity:number) {
//   return `rgba(var(${rgb}), ${opacity})`
// }


export default {
  content: [
    "./index.html",
    "./renderer/**/*.{vue,js,ts}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true
    },
    extend: {
      fontFamily:{
        customfont:['LGSmHa', 'san-serif']
      },
      colors: {
        //surface colors from https://tailwindcolor.com/ (stone)
        'dark': {
          'surface': {
            'lowest': '#000000',
            'low': '#0C0A09',
            'DEFAULT': '#1C1917',
            'high': '#292524', //Hover
            'highest': '#44403C', //Form Container
            'on': {
              'DEFAULT': '#C4C7C5',
              'muted': '#78716C'
            }
          },
          'border': '#78716C'
        },
        'light': {
          'surface': {
            'lowest': '#FFFFFF',
            'low': '#FAFAF9',
            'DEFAULT': '#F5F5F4',
            'high': '#E4E4E7', //Hover
            'highest': '#D6D3D1', //Form Container
            'on': {
              'DEFAULT': '#444746',
              'muted': '#A8A29E'
            }
          },
          'border': '#A8A29E'
        },
        'primary': {
          'DEFAULT': '#009688',
          'darken': '#00796B',
          'on': '#FFFFFF'
        },
        'secondary': '#96000E',
        'warning': '#ff355b',
        'info': '#2196F3',
        'success': '#4CAF50',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
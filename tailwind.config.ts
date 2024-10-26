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
        },
        'primary': {
          'DEFAULT': '#009688',
          'lighten': '#B2DFDB',
          'darken': '#00695C',
          'on': '#FFFFFF'
        },
        'secondary': {
          'DEFAULT': '#2196F3',
          'lighten': '#BBDEFB',
          'darken': '#0D47A1',
          'on': '#FFFFFF'
        },
        'warning': {
          'DEFAULT': '#FF9800',
          'lighten': '#FFE0B2',
          'darken': '#E65100'
        },
        'error': {
          'DEFAULT': '#F44336',
          'lighten': '#FFCDD2',
          'darken': '#B71C1C'
        },
        'info': {
          'DEFAULT': '#673AB7',
          'lighten': '#D1C4E9',
          'darken': '#4527A0'
        },
        'success': {
          'DEFAULT': '#4CAF50',
          'lighten': '#C8E6C9',
          'darken': '#1B5E20'
        },
      },
      borderColor: {
        DEFAULT: '#757575',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
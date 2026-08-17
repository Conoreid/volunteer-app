/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/(tabs)/**/*.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
  ],

  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006767',
          container: '#008282',
          light: '#8cf3f3',
          dark: '#004f4f',
        },
        secondary: {
          DEFAULT: '#505f77',
          container: '#d1e0fd',
          dark: '#0c1c31',
        },
        surface: {
          DEFAULT: '#faf8fe',
          bright: '#faf9fe',
          dim: '#dad9df',
          container: '#eeedf3',
          'container-low': '#f4f3f8',
          'container-high': '#e9e7ed',
          'container-highest': '#e3e2e7',
          dark: '#000000',
          'dark-card': '#1a1b1f',
          'dark-elevated': '#2f3034',
        },
        'on-surface': {
          DEFAULT: '#1a1b1f',
          variant: '#3d4949',
          dark: '#f9fafb',
          'dark-variant': '#9ca3af',
        },
        semantic: {
          success: '#016b1b',
          'success-container': '#2a8532',
          warning: '#eab308',
          error: '#ba1a1a',
          'error-container': '#ffdad6',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#ffffff',
          secondary: '#f5f5f7',
          text: '#1d1d1f',
          sub: '#86868b',
          blue: '#0066cc'
        }
      },
      borderRadius: {
        'apple': '22px',
      }
    },
  },
  plugins: [],
}
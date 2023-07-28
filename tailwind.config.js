/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'senut-red': '#ff0000',
        'senut-green': '#00ff00',
        'senut-black': '#ffffff',
        
      },

      backgroundImage: {
        'law-BG': '/src/public/Law_BG.png',
        'banner-BG': '/src/public/PartyAlignmentBar.png',
        'voteFor': '/src/public/Button_For.png',
        'voteAgainst': '/src/public/Button_Against.png'
      }
    },
  },
  plugins: [],
};

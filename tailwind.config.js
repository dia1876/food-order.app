module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          light: '#FAF6F0',
          base: '#C18E60',
          hover: '#a36f43',
          text: '#5C4033',
        },
      },
    },
  },
  plugins: [],
}


// tailwind.config.js を自動生成するためのコード
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          light: '#F5E6D3',  // ← ベージュ感が強くなって差が分かる
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
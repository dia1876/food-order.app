// tailwind.config.js に以下を手動で記述
/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cafe: {
          light: '#FAF6F0',   // 背景ベージュ
          base: '#C18E60',    // メインブラウン
          hover: '#a36f43',   // ホバーカラー
          text: '#5C4033',    // テキスト色
        },
      },
    },
  },
  plugins: [],
}

// tailwind.config.js を自動生成するためのコード